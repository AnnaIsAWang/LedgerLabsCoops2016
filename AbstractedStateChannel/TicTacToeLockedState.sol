import "LockedStateWithFunds.sol";

/**
 * TicTacToeLockedState
 *
 * The LockedState for a TicTacToe game.
 */
contract TicTacToeLockedState is LockedStateWithFunds {

    // byte mappings for state
    // 0-19 address1, the recipient of send1
    // 20-39 address2, the recipient of send2
    // 40-71 send1, amount of wei to send to address1
    // 72-104 send2, amount of wei to send to address2


    /**
     * Parses and returns a 4-tuple representing the address1, address2, send1, send2
     * corresponding to the state.
     *
     * state: the state to be parsed
     * returns: a 4-tuple, (address address1, address address2, uint send1, uint send2)
     */
    function parseState(bytes state)
        constant returns (address address1, address address2, uint send1, uint send2)
    {
        uint i;
        uint160 uintAddress1 = 0;
        uint160 uintAddress2 = 0;

        for (i = 0; i < 20; i++) {
            uintAddress1 |= uint8(state[i]) * uint160(2**(i*8));
        }
        address1 = uintAddress1;

        for (i = 0; i < 20; i++) {
            uintAddress2 |= uint8(state[i+20]) * uint160(2**(i*8));
        }
        address2 = uintAddress2;

        for (i = 0; i < 32; i++) {
            send1 |= uint8(state[i+40]) * 2**(i*8);
        }

        for (i = 0; i < 32; i++) {
            send2 |= uint8(state[i+72]) * 2**(i*8);
        }
    }

    /**
     * Checks if a given state is valid.
     * send1 + send2 must be equal to the balance of address1 + the balance of address2
     *
     * state: the state to check
     * returns: true if the state is valid, otherwise false
     */
    function checkState(bytes state) constant returns (bool) {
        address address1;
        address address2;
        uint send1;
        uint send2;

        (address1, address2, send1, send2) = parseState(state);
        return send1 + send2 == getBalance(address1) + getBalance(address2);
    }

    /**
     * Sends the amount of funds to each address, as allotted.
     *
     * state: the state that will be broadcast
     * returns: true if transaction sent sucessfully, otherwise false
     */
    function broadcastState(bytes state) external onlyOwner returns (bool) {
        if (!checkState(state)) {
            return false;
        }

        address address1;
        address address2;
        uint send1;
        uint send2;

        (address1, address2, send1, send2) = parseState(state);

        if (!address1.send(send1)) {
            throw;
        }

        if (!address2.send(send2)) {
            throw;
        }

        return true;
    }
}
