import "LockedStateWithFunds.sol";

/**
 * TicTacToeLockedState
 *
 * The LockedState for a TicTacToe game.
 */
contract TicTacToeLockedState is LockedState {

    /* bit mappings for state
     * 0: X gets winnings
     * 1: O gets winnings
     * 2: X forfeits adjudication deposit
     * 3: O forfeits adjudication deposit
     * 4: X forfeits disconnect deposit
     * 5: O forfeits disconnect deposit
     * 6: used to indicate cheating, not used here
     * note, if tie, bits 0 and 1 should both be 0 to indicate tie
     */
    address addressX;
    address addressO;
    address burner = 0;

    uint[6] funds;

    function TicTacToeLockedState(address _addressX, address _addressO) {
        addressX = _addressX;
        addressO = _addressO;
    }

    function deposit(uint account) {
        if (account >= 6) {
            throw;
        } else {
            funds[account] += msg.value;
        }
    }

    /**
     * Checks if a given state is valid.
     * Must be a bytes1 that holds the specified values above.
     *
     * state: the state to check
     * returns: true if the state is valid, otherwise false
     */
    function checkState(bytes state) constant returns (bool) {
        if (state.length == 1) {
            return uint8(state[0]) & 0x03 != 0x03;
        } else {
            return false;
        }
    }

    /**
     * Splits the funds according to the state.
     *
     * state: the state that will be broadcast
     * returns: true if transaction sent sucessfully, otherwise false
     */
    function broadcastState(bytes state) external onlyOwner returns (bool) {
        if (!checkState(state)) {
            return false;
        }

        uint sendToX = 0;
        uint sendToO = 0;

        uint uintState = uint(state[0]);

        if (uintState & 0x03 == 0x01) {
            sendToX += funds[0] + funds[1];
        } else if (uintState & 0x03 == 0x02) {
            sendToO += funds[0] + funds[1];
        } else {
            sendToX += funds[0];
            sendToO += funds[1];
        }

        sendToX += (uintState & 0x04 == 0 ? funds[2] : 0) + (uintState & 0x10 == 0 ? funds[4] : 0);
        sendToO += (uintState & 0x08 == 0 ? funds[3] : 0) + (uintState & 0x20 == 0 ? funds[5] : 0);

        if (!addressX.send(sendToX)) {
            throw;
        }

        if (!addressO.send(sendToO)) {
            throw;
        }

        if (!burner.send(this.balance)) {
            throw;
        }

        return true;
    }

    function () {
        throw;
    }
}
