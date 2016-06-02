import "Rules.sol";
import "TicTacToeAdjudicator.sol";

/* Grid is as follows:
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

    function TicTacToeRules(address _addressX, address _addressO, uint _timeout) {
        addressX = _addressX;
        addressO = _addressO;
        timeout = _timeout;
    }

    function createAdjudicator() internal returns (Adjudicator newAdjudicator) {
        newAdjudicator = new TicTacToeAdjudicator(addressX, addressO, timeout);
        delete timeout;
    }

    function gridToIndex(uint x, uint y) constant internal returns (uint) {
        return x + 3*y;
    }

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

        return adjudicator.close(2, state, nonce, v, r, s);
    }

    function unilateralRuling(uint8 uintState, uint nonce, uint sender) internal returns (bool) {
        bytes memory state = new bytes(1);
        state[0] = byte(uintState);
        adjudicator.close(0, state, nonce, new uint8[](1), new bytes32[](1), new bytes32[](1));
    }

    function sendBoard(
        uint sender,
        bytes10 board,
        uint nonce,
        uint8 vX,
        bytes32 rX,
        bytes32 sX,
        uint8 vO,
        bytes32 rO,
        bytes32 sO
    ) external returns (bool) {
        uint x;
        uint y;
        uint i;
        uint8 uintState = sender == X ? 0x28 : 0x14;

        if (
            !((uint(board[9]) == X && addressX == ecrecover(sha3(sender, board, nonce), vX, rX, sX))
            || (uint(board[9]) == O && addressO == ecrecover(sha3(sender, board, nonce), vO, rO, sO)))
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
                return unilateralRuling(uintState | 0x01 , nonce, sender);
            } else if (i == O * 3) {
                return unilateralRuling(uintState | 0x02, nonce, sender);
            }
        }

        // checking -
        for (y = 0; y < 3; y++) {
            i = 0;
            for (x = 0; x < 3; x++) {
                i += uint(board[gridToIndex(x, y)]);
            }
            if (i == X * 3) {
                return unilateralRuling(uintState | 0x01, nonce, sender);
            } else if (i == O * 3) {
                return unilateralRuling(uintState | 0x02, nonce, sender);
            }
        }

        // checking \
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(uintState | 0x01, nonce, sender);
        } else if (i == O * 3) {
            return unilateralRuling(uintState | 0x02, nonce, sender);
        }

        // checking /
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, 2 - x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(uintState | 0x01, nonce, sender);
        } else if (i == O * 3) {
            return unilateralRuling(uintState | 0x02, nonce, sender);
        }

        // check if tie
        for (i = 0; i < 9; i++) {
            if (board[i] == BLANK) {
                // last player wins
                return unilateralRuling(uintState | uint(board[9]) == X ? 0x01 : 0x02, nonce, sender);
            }
        }
        // it is a tie
        return unilateralRuling(uintState, nonce, sender);
    }

    function badBoardSent() {
        // implement the signature checking and all that fun bullshit over here please
        // oldBoard and newBoard???
        bool notChanged = true;
        for (uint i = 0; i < 9; i++) {
            if (oldBoard[i] == newBoard[i]) {
                break;
            }
            if ((newBoard[i] == X || newBoard[i] == O) && (oldBoard[i] != newBoard[i]) && (oldBoard[i] == BLANK) && (notChanged && newBoard[i] == newBoard[9])) {
                notChanged = false;
                break;
            }
            // shenanigans
        }
        if (notChanged) {
            // shenanigans!
        } else {
            // no shenanigans
        }
    }

    function checkIn(uint player, uint nonce) {
        uint8 uintState = uint8(adjudicator.getState()[0]);
        if (nonce == adjudicator.getNonce() && uintState & 0x40 == 0) {
            uintState = uintState & 0xCF | 0x0C;
        }
    }
}
