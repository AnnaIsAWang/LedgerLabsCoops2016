import "LockedStateWithFunds.sol";

/**
 * TicTacToeLockedState
 *
 * The LockedState for a TicTacToe game.
 */
contract TicTacToeLockedState is LockedState {

    // byte mapping for state
    // 0 - is a tie
    // 1 - X wins
    // 2 - O wins
    // 3 - X wins (O cheated)
    // 4 - O wins (X cheated)

    /**
     * Checks if a given state is valid.
     * Must be a bytes1 that holds the specified values above.
     *
     * state: the state to check
     * returns: true if the state is valid, otherwise false
     */
    function checkState(bytes state) constant returns (bool) {
        if (state.length == 1) {
            uint uintState = uint(state[0]);
            return 0 <= uintState && uintState <= 4;
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

        uint uintState =  uint(state[0]);
        if (uintState == 0) {
            if (addressX.send(this.balance / 2)) {
                throw;
            }
            if (addressO.send(this.balance)) {
                throw;
            }
        } else if (uintState == 1) {
            if (addressO.send(this.balance / 4)) {
                throw;
            }
            if (addressX.send(this.balance)) {
                throw;
            }
        } else if (uintState == 2) {
            if (addressX.send(this.balance / 4)) {
                throw;
            }
            if (addressO.send(this.balance)) {
                throw;
            }
        } else if (uintState == 3) {
             if (addressX.send(this.balance)) {
                throw;
             }
        } else if (uintState == 4) {
            if (addressO.send(this.balance)) {
                throw;
            }
        } else {
            throw;
        }

        return true;
    }
}
