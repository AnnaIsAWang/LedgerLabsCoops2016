import "Adjudicator.sol";
import "TicTacToeLockedState.sol";

contract TicTacToeAdjudicator is Adjudicator {

    function TicTacToeAdjudicator(address address1, address address2, uint _timeout)
        Adjudicator(new address[](2), 2, _timeout)
    {
        addresses[0] = address1;
        addresses[1] = address2;
    }

    function createLockedState() internal returns (LockedState) {
        return new TicTacToeLockedState();
    }
}
