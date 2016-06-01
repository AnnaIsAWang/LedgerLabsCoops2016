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

    uint lastValidSender;
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

    function unilateralRuling(uint8 uintState, uint nonce) internal returns (bool) {
        bytes state = new bytes(1);
        state[0] = byte(uintState);
        return adjudicator.close(0, state, nonce, new uint8[](1), new bytes32(1), new bytes32(1));
    }

    function sendBoard(
        bytes10 board,
        uint nonce,
        uint8 vX,
        bytes32 rX,
        bytes32 sX,
        uint8 vO,
        bytes32 rO,
        bytes32 sO
    ) external returns (bool) {
        uint currentLastSender = uint(board[9]);
        uint i;
        uint x;
        uint y;

        if (
            !((currentLastSender == X && addressX == ecrecover(hash, vX, rX, sX))
            || (currentLastSender == O && addressO == ecrecover(hash, vO, rO, sO)))
        ) {
            return false;
        }

        x = 0;
        y = 0;
        for (i = 0; i < 9; i++) {
            if (board[i] == X) {
                x++;
            } else if (board[i] == O) {
                y++;
            } else if (board[i] != BLANK) {//invalid symbol, someone cheated
                return unilateralRuling(
                    currentLastSender == X ? 0x1E : 0x2D,
                    nonce
                );
            }
        }
        if (x + y == 9) {// tie
            return unilateralRuling(0x0C, nonce);
        } else if (currentLastSender == X && x - y != 1) {// X cheated
            return unilateralRuling(0x1E, nonce);
        } else if (currentLastSender == O && x - y != 0) {// O cheated
            return unilateralRuling(0x2D, nonce);
        }

        //checking |
        for (x = 0; x < 3; x++) {
            i = 0;
            for (y = 0; y < 3; y++) {
                i += uint(board[gridToIndex(x, y)]);
            }
            if (i == X * 3) {
                return unilateralRuling(0x0D, nonce);
            } else if (i == O * 3) {
                return unilateralRuling(0x0E, nonce);
            }
        }

        //checking -
        for (y = 0; y < 3; y++) {
            i = 0;
            for (x = 0; x < 3; x++) {
                i += uint(board[gridToIndex(x, y)]);
            }
            if (i == X * 3) {
                return unilateralRuling(0x0D, nonce);
            } else if (i == O * 3) {
                return unilateralRuling(0x0E, nonce);
            }
        }

        //checking \
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(0x0D, nonce);
        } else if (i == O * 3) {
            return unilateralRuling(0x0E, nonce);
        }

        //checking /
        i = 0;
        for (x = 0; x < 3; x++) {
            i += uint(board[gridToIndex(x, 2 - x)]);
        }
        if (i == X * 3) {
            return unilateralRuling(0x0D, nonce);
        } else if (i == O * 3) {
            return unilateralRuling(0x0E, nonce);
        }

        return unilateralRuling(
            currentLastSender == X ? 0x1E : 0x2D,
            nonce
        );
    }
}
