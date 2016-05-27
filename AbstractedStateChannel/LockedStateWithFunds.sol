import "LockedState.sol";

contract LockedStateWithFunds is LockedState {

    event FundsAdded(address from, address to, uint amount);

    mapping (address => uint) balances;

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
