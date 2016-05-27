import "Rules.sol";
import "TicTacToeAdjudicator.sol";

contract TicTacToeRules is Rules {

    address address1;
    address address2;
    uint timeout;

    function TicTacToeRules(address _address1, address _address2, uint _timeout) {
        address1 = _address1;
        address2 = _address2;
        timeout = _timeout;
    }

    function createAdjudicator() internal returns (Adjudicator adjudicator) {
        adjudicator = new TicTacToeAdjudicator(address1, address2, timeout);
        delete address1;
        delete address2;
        delete timeout;
    }
}
