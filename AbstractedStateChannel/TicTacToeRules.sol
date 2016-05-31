import "Rules.sol";
import "TicTacToeAdjudicator.sol";

/* Grid is as follows:
 *  0 | 1 | 2
 *  ---------
 *  3 | 4 | 5
 *  ---------
 *  6 | 7 | 8
 */
contract TicTacToeRules is Rules {

    uint constant NONE = 0;
    uint constant X = 1;
    uint constant O = 4;

    bytes TIE;
    bytes X_WINS;
    bytes O_WINS;
    bytes X_SUPER_WINS;
    bytes O_SUPER_WINS;

    address addressX;
    address addressO;
    uint timeout;

    function TicTacToeRules(address _addressX, address _addressO, uint _timeout) {
        addressX = _addressX;
        addressO = _addressO;
        timeout = _timeout;
        TIE = new bytes(1);
        X_WINS = new bytes(1);
        O_WINS = new bytes(1);
        X_SUPER_WINS = new bytes(1);
        O_SUPER_WINS = new bytes(1);
        TIE[0] = byte(0);
        X_WINS[0] = byte(1);
        O_WINS[0] = byte(2);
        X_SUPER_WINS[0] = byte(3);
        O_SUPER_WINS[0] = byte(4);
    }

    function createAdjudicator() internal returns (Adjudicator adjudicator) {
        adjudicator = new TicTacToeAdjudicator(addressX, addressO, timeout);
        delete addressX;
        delete addressO;
        delete timeout;
    }

    function gridToIndex(uint x, uint y) constant internal returns (uint) {
        return x + 3*y;
    }

    function sendState(
        bytes state,
        uint nonce,
        uint8 v1,
        bytes32 r1,
        bytes32 s1,
        uint8 v2,
        bytes32 r2,
        bytes32 s2
    ) external returns (bool) {
        uint8[] memory v = new uint8[](2);
        bytes32[] memory r = new bytes32[](2);
        bytes32[] memory s = new bytes32[](2);

        v[0] = v1;
        v[1] = v2;
        r[0] = r1;
        r[1] = r2;
        s[0] = s1;
        s[1] = s2;

        return adjudicator.close(2, state, nonce, v, r, s);
    }

    function sendBoard(
        bytes9 board,
        uint nonce,
        uint8 v1,
        bytes32 r1,
        bytes32 s1,
        uint8 v2,
        bytes32 r2,
        bytes32 s2
    ) external returns (bool) {
        uint sum;
        uint i;
        uint x;
        uint y;
        uint8[] memory v = new uint8[](2);
        bytes32[] memory r = new bytes32[](2);
        bytes32[] memory s = new bytes32[](2);

        v[0] = v1;
        v[1] = v2;
        r[0] = r1;
        r[1] = r2;
        s[0] = s1;
        s[1] = s2;

        //checking |
        for (x = 0; x < 3; x++) {
            sum = 0;
            for (y = 0; y < 3; y++) {
                sum += uint(board[gridToIndex(x, y)]);
            }
            if (sum == X * 3) {
                adjudicator.close(0, X_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            } else if (sum == O * 3) {
                adjudicator.close(0, O_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            }
        }

        //checking -
        for (y = 0; y < 3; y++) {
            sum = 0;
            for (x = 0; x < 3; x++) {
                sum += uint(board[gridToIndex(x, y)]);
            }
            if (sum == X * 3) {
                adjudicator.close(0, X_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            } else if (sum == O * 3) {
                adjudicator.close(0, O_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            }
        }

        //checking \
        sum = 0;
        for (x = 0; x < 3; x++) {
            sum += uint(board[gridToIndex(x, x)]);
        }
        if (sum == X * 3) {
            adjudicator.close(0, X_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        } else if (sum == O * 3) {
            adjudicator.close(0, O_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        }

        //checking /
        sum = 0;
        for (x = 0; x < 3; x++) {
            sum += uint(board[gridToIndex(x, 2 - x)]);
        }
        if (sum == X * 3) {
            adjudicator.close(0, X_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        } else if (sum == O * 3) {
            adjudicator.close(0, O_WINS, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        }

        //checking if there's a tie
        x = 0;
        y = 0;
        for (i = 0; i < 9; i++) {
            if (board[i] == byte(X)) {
                x++;
            } else if (board[i] == byte(O)) {
                y++;
            }
        }

        // what happens if someone isn't being honest??
        //check if the board is invalid
        //WRITE SOME EXPOSURES CODE HERE!
        //ALSO, test to see if this shit actually works lmao
        if (x + y == 9) {
            adjudicator.close(0, TIE, nonce, new uint8[](2), new bytes32[](2), new bytes32[](2));
        }
    }
}
