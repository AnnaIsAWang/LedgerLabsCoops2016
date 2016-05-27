contract Owned {

    address owner;

    function Owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) {
            throw;
        } else {
            _
        }
    }
}
