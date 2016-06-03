import "Rules.sol";
import "TicTacToeAdjudicator.sol";

/* Board state values are as follows:
 *  0 | 1 | 2
 *  ---------
 *  3 | 4 | 5
 *  ---------
 *  6 | 7 | 8
 *
 * 9: 4 if last player was O, 1 if the last player was X
 */
contract TicTacToeRules is Rules {

    uint constant BLANK = 0;
    uint constant X = 1;
    uint constant O = 4;

    address addressX;
    address addressO;
    uint timeout;

    /**
     * Creates a new TicTacToeRules
     * _addressX: the address of X
     * _addressO: the address of O
     * _timeout: the timeout before state can be closed
     */
    function TicTacToeRules(address _addressX, address _addressO, uint _timeout) {
        addressX = _addressX;
        addressO = _addressO;
        timeout = _timeout;
    }

    function createAdjudicator() internal returns (Adjudicator newAdjudicator) {
        newAdjudicator = new TicTacToeAdjudicator(addressX, addressO, timeout);
        delete timeout;
    }

    // Converts a grid coordinate to an index value
    function gridToIndex(uint x, uint y) constant internal returns (uint) {
        return x + 3*y;
    }

    /**
     * Send a state directly to the underlying state channel.
     * Allows for transactions to be closed without any adjudication fees.
     *
     * state: the state that will be sent
     * nonce: the nonce that will be sent
     * the rest are signature values for X and O, respectively
     * returns: true if state sent sucessfully, otherwise false
     */
    function sendState(
        bytes state,
        uint nonce,
        uint8 vX,
        bytes32 rX,
        bytes32 sX,
        uint8 vO,
        bytes32 rO,
        bytes32 sO
    ) external returns (bool) {
        uint8[] memory v = new uint8[](2);
        bytes32[] memory r = new bytes32[](2);
        bytes32[] memory s = new bytes32[](2);

        v[0] = vX;
        v[1] = vO;
        r[0] = rX;
        r[1] = rO;
        s[0] = sX;
        s[1] = sO;

        return adjudicator.close(2, state, nonce, this, v, r, s);
    }

    /**
     * Sends a unilateral ruling (0 signatures required) to underlying adjudicator.
     *
     * uintState: the state which will be sent
     * nonce: the nonce which will be sent
     * returns: true if the state was sent successfully, otherwise false
     */
    function unilateralRuling(uint8 uintState, uint nonce) internal returns (bool) {
        bytes memory state = new bytes(1);
        state[0] = byte(uintState);
        adjudicator.close(0, state, nonce, this, new uint8[](1), new bytes32[](1), new bytes32[](1));
    }

    /**
     * Sends a board to be adjudicated upon.
     *
     * board: the board to be adjudicated upon
     * nonce: the nonce that will be used
     * v, r, s: X's signature if last player was X, O's signature if last player was O
     * returns: true if adjudication was sucessful, otherwise false
     */
    function sendBoard(
        bytes10 board,
        uint nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool) {
        uint x;
        uint y;
        uint i;
        uint8 uintState = uint(board[9]) == X ? 0x28 : 0x14;// by default, the person who didn't play will lose all deposits

        if (
            !((uint(board[9]) == X && addressX == ecrecover(sha3(board, nonce), v, r, s))
            || (uint(board[9]) == O && addressO == ecrecover(sha3(board, nonce), v, r, s)))
        ) {
            return false;
        }

        // do something about what happens if you send old boards???

        // checking wins
        // checking |
        for (x = 0; x < 3; x++) {
            i = 0;
            for (y = 0; y < 3; y++) {
                i += uint(board[gridToIndex(x, y)]);
            }
            if (i == X * 3) {
                return unilateralRuling(uintState | 0x01 , nonce);// give X the bet winnings
            } else if (i == O * 3) {
                return unilateralRuling(uintState | 0x02, nonce);// give O the bet winnings
            }
        }

        // checking -
        for (y = 0; y < 3; y++) {
            i = 0;
            for (x = 0; x < 3; x++) {
                i += uint(board[gridToIndex(x, y)]);
            }
            if (i == X * 3) {
                return unilateralRuling(uintState | 0x01, nonce);
            } else if (i == O * 3) {
                return unilateralRuling(uintState | 0x02, nonce);
            }
        }

        // checking \
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(uintState | 0x01, nonce);
        } else if (i == O * 3) {
            return unilateralRuling(uintState | 0x02, nonce);
        }

        // checking /
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, 2 - x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(uintState | 0x01, nonce);
        } else if (i == O * 3) {
            return unilateralRuling(uintState | 0x02, nonce);
        }

        // check if tie
        for (i = 0; i < 9; i++) {
            if (uint(board[i]) == BLANK) {
                // last player wins
                return unilateralRuling(uintState | uint(board[9]) == X ? 0x01 : 0x02, nonce);// bets sent to last player
            }
        }
        // it is a tie
        return unilateralRuling(uintState, nonce);// if tie, bets returned
    }

    /**
     * Punishes a sender for sending an errornous board.
     *
     * oldBoard: the old board to be compared against
     * oldNonce: the old nonce to verify the old board
     * oldV, oldR, oldS: the signature for oldBoard, from the last player
     * newBoard: the new board which has an error
     * newNonce: the new nonce of newBoard
     * newV, newR, newS: the signatures for newBoard, from the last player
     */
    function badBoardSent(
        bytes10 oldBoard,
        uint oldNonce,
        uint8 oldV,
        bytes32 oldR,
        bytes32 oldS,
        bytes10 newBoard,
        uint newNonce,
        uint8 newV,
        bytes32 newR,
        bytes32 newS
    ) external returns (bool) {
        // verify the integrity of oldBoard
        if (
            !((uint(oldBoard[9]) == X && addressX == ecrecover(sha3(oldBoard, oldNonce), oldV, oldR, oldS))
            || (uint(oldBoard[9]) == O && addressO == ecrecover(sha3(oldBoard, oldNonce), oldV, oldR, oldS)))
        ) {
            return false;
        }

        // verify the integrity of newBoard
        if (
            !((uint(newBoard[9]) == X && addressX == ecrecover(sha3(newBoard, newNonce), newV, newR, newS))
            || (uint(newBoard[9]) == O && addressO == ecrecover(sha3(newBoard, newNonce), newV, newR, newS)))
        ) {
            return false;
        }

        bool notChanged = true;
        for (uint i = 0; i < 9; i++) {
            if (oldBoard[i] == newBoard[i]) {
                break;
            }
            if ((uint(newBoard[i]) == X || uint(newBoard[i]) == O) && (uint(oldBoard[i]) == BLANK) && notChanged && (newBoard[i] == newBoard[9])) {
                notChanged = false;
                break;
            }
            // shenanigans
            return unilateralRuling(uint(newBoard[9]) == X ? 0x56 : 0x69, newNonce);
        }
        if (notChanged) {
            // shenanigans
            return unilateralRuling(uint(newBoard[9]) == X ? 0x56 : 0x69, newNonce);
        } else {
            // nothing fishy
            return false;
        }
    }

    /**
     * Lets the contract know that you have not disconnected.
     * Will modify the state such that the disconnect deposits will be
     * refunded and both party's adjudication deposits will be lost.
     *
     * returns: true if sucessful, otherwise false
     */
    function checkIn() external returns (bool) {
        uint8 uintState = uint8(adjudicator.getStateAt(0));
        if (uintState & 0x40 != 0x00 || uintState & 0x0C != 0x00) {
            return false;
        }
        return unilateralRuling(uintState & 0xCF | 0x0C, adjudicator.getNonce());
    }
}
