import "LockedState.sol";

/**
 * LockedStateWithFunds
 *
 * LockedState which implements the tracking of funds sent to it.
 */
contract LockedStateWithFunds is LockedState {

    // Event triggered whenever funds have been added
    event FundsAdded(address from, address to, uint amount);

    mapping (address => uint) balances;

    /**
     * Gets the balance of the address passed in.
     *
     * toCheck: the address to check the balance for
     * returns: the balance
     */
    function getBalance(address toCheck) constant returns (uint) {
        return balances[toCheck];
    }

    function addFunds(address recipient) {
        balances[recipient] += msg.value;
    }

    function () {
        addFunds(msg.sender);
    }
}
