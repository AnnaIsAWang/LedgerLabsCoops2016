import "Owned";

contract LockedState is Owned {

    function checkState(bytes state) constant returns (bool);
    function broadcastState(bytes state) external onlyOwner returns (bool);

    function kill() external onlyOwner {
        selfdestruct(owner);
    }
}
