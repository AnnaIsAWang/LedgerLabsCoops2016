# A Guide on Using the Tic Tac Toe User Interface

## Getting Started
In order to use the Tic Tac Toe interface to play a real live game of Tic Tac Toe on Abstracted State Channels, you will either need to have [geth](https://github.com/ethereum/go-ethereum/wiki/geth) running. However, for demonstrational purposes (and to get a feel of how to use the interface), it is ideal to instead have [testrpc](https://github.com/ethereumjs/testrpc) running. If you are using the latter, remember to also get your localhost server up and running and everything should proceed smoothly.

Note: Remember to unlock any account that you are planning to use to play

## How to Play the Game
Once you have the game loaded, the first step is to create a contract while specifying player X, player O, and the timeout (located in the first section of the top yellow box). You may then need to wait a couple seconds for your contract to be mined, once it is succesfully mined, an alert message should pop up letting you know that you're ready to start playing the game.

A game is always more fun when there are stakes. The next suggested course of action is to go down the bottom of the page to the Tic Tac Toe Locked State titled yellow box and deposit some funds into your repsective accounts. In that same section there is the option to check balances which makes it easy for you to verify that you and your opponent are putting the same amount of money up for grabs and that every account is being deposited to correctly.

Now decide which player will take the first move. As that player, you can then go down to the Sign Board section under Signatures and fill in the board with your first move and sign it. Then, the other player must also sign the board with your first move on it and can then make their own move on the board, sign it, pass it to you, etc.

After the game has come to a finish, either player can finalise channel (under the Tic Tac Toe Adjudicator section) and the funds will be distributed accordingly. Now any interactions with the contract will throw up an error since the contract will have been terminated.

## What to do if...
###### You accidentally refresh the page and don't want to create a new contract everytime your slippery fingers press the refresh button by accident
If this happens, do not fret! You can simply choose to attach to existing contract right under where you created a new contract and the address of your most recent contract should be automatically filled in already for you!

###### Your opponent goes offline

###### You go offline

###### Your opponent goes twice and/or overwrites your move

###### You want to finalise the channel before the timeout has expired

###### You forgive your opponent for cheating and continue playing

###### You want to kill the contract because you're a killer

###### You want to get rid of old data hanging out in your signature tables
