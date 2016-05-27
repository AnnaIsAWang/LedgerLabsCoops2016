#!/bin/sh

input='
Owned.sol
Adjudicator.sol
LockedState.sol
LockedStateWithFunds.sol
Rules.sol
TicTacToeAdjudicator.sol
TicTacToeLockedState.sol
TicTacToeRules.sol
'

grep -hv '^import' $input | xclip -sel clip
echo 'Copied!'
