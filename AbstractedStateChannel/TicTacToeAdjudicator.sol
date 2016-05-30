import "Adjudicator.sol";
import "TicTacToeLockedState.sol";

/**
 * TicTacToeAdjudicator
 *
 * Adjudicates a TicTacToe game.
 */
contract TicTacToeAdjudicator is Adjudicator {

    /**
     * Creates a new TicTacToeAdjudicator
     *
     * address1: The address of the first player
     * address2: The address of the second player
     * _timeout: The amount of time required before the state channel can be closed normally.
     */
    function TicTacToeAdjudicator(address address1, address address2, uint _timeout)
        Adjudicator(new address[](2), 2, _timeout)
    {
        addresses[0] = address1;
        addresses[1] = address2;
    }

    // creates and returns a new TicTacToeLockedState
    function createLockedState() internal returns (LockedState) {
        return new TicTacToeLockedState();
    }
}
