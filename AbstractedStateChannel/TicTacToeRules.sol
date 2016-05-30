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

    constant uint NONE = 0;
    constant uint X = 1;
    constant uint O = 4;

    address addressX;
    address addressO;
    uint timeout;

    function TicTacToeRules(address _addressX, address _addressO, uint _timeout) {
        addressX = _addressX;
        addressO = _addressO;
        timeout = _timeout;
    }

    function createAdjudicator() internal returns (Adjudicator adjudicator) {
        adjudicator = new TicTacToeAdjudicator(addressX, addressO, timeout);
        delete addressX;
        delete addressO;
        delete timeout;
    }

    function gridToIndex(uint x, uint y) constant internal returns (uint) {
        return x + GRID_SIZE*y;
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
        uint8[] v = new uint8[](2);
        bytes32[] r = new bytes32[](2);
        bytes32[] s = new bytes32[](2);

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
        uint x;
        uint y;
        uint8[] v = new uint8[](2);
        bytes32[] r = new bytes32[](2);
        bytes32[] s = new bytes32[](2);

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
                sum += uint(state[gridToIndex(x, y)]);
            }
            if (sum == X * 3) {
                adjudicator.close(0, nonce, byte(1), new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            } else if (sum == O * 3) {
                adjudicator.close(0, nonce, byte(2), new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            }
        }

        //checking -
        for (y = 0; y < 3; y++) {
            sum = 0;
            for (x = 0; x < 3; x++) {
                sum += uint(state[gridToIndex(x, y)]);
            }
            if (sum == X * 3) {
                adjudicator.close(0, nonce, byte(1), new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            } else if (sum == O * 3) {
                adjudicator.close(0, nonce, byte(2), new uint8[](2), new bytes32[](2), new bytes32[](2));
                return true;
            }
        }

        //checking \
        sum = 0;
        for (x = 0; x < 3; x++) {
            sum += uint(state[gridToIndex(x, x)]);
        }
        if (sum == X * 3) {
            adjudicator.close(0, nonce, byte(1), new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        } else if (sum == O * 3) {
            adjudicator.close(0, nonce, byte(2), new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        }

        //checking /
        sum = 0;
        for (x = 0; x < 3; x++) {
            sum += uint(state[gridToIndex(x, 3-1 - x)]);
        }
        if (sum == X * 3) {
            adjudicator.close(0, nonce, byte(1), new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        } else if (sum == O * 3) {
            adjudicator.close(0, nonce, byte(2), new uint8[](2), new bytes32[](2), new bytes32[](2));
            return true;
        }

        //checking if there's a tie
        x = 0;
        y = 0;
        for (i = 0; i < 3 * 3; i++) {
            if (state[i] == byte(X)) {
                x++;
            } else if (state[i] == byte(Y)) {
                y++;
            }
        }

        // what happens if someone isn't being honest??
        if (x + y == 9) {
            adjudicator.close(0, nonce, byte(0), new uint8[](2), new bytes32[](2), new bytes32[](2));
        }
    }
}
