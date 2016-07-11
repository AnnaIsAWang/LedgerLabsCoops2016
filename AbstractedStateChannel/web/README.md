# A Guide on Using the Tic Tac Toe User Interface

## Getting Started
In order to use the Tic Tac Toe interface to play a real live game of Tic Tac Toe on Abstracted State Channels, you will either need to have [geth](https://github.com/ethereum/go-ethereum/wiki/geth) running. However, for demonstrational purposes (and to get a feel of how to use the interface), it is ideal to instead have [testrpc](https://github.com/ethereumjs/testrpc) running. If you are using the latter, remember to also get your localhost server up and running and everything should proceed smoothly.

Once you are all set up, you can simply clone this repository onto your local device, then use the command "sudo python -m SimmpleHTTPSServer 80" in the command line inside this directory. Then, open up your localhost:80 and you should be good to go!

Note: Remember to unlock any account that you are planning to use to play

## How to Play the Game
Once you have the game loaded, the first step is to create a contract while specifying player X, player O, and the timeout (located in the first section of the top yellow box). You may then need to wait a couple seconds for your contract to be mined, once it is succesfully mined, an alert message should pop up letting you know that you're ready to start playing the game.

A game is always more fun when there are stakes. The next suggested course of action is to go down the bottom of the page to the Tic Tac Toe Locked State titled yellow box and deposit some funds into your repsective accounts. In that same section there is the option to check balances which makes it easy for you to verify that you and your opponent are putting the same amount of money up for grabs and that every account is being deposited to correctly.

Now decide which player will take the first move. As that player, you can then go down to the Sign Board section under Signatures and fill in the board with your first move and sign it. Then, the other player must also sign the board with your first move on it and can then make their own move on the board, sign it, pass it to you, etc.

After the game has come to a finish, either player can send the board in for final evaluation by going to the Send Board option in the Tic Tac Toe Rules yellow box. To check that the board was sent successfully, use either the Get Last Sent Nonce button or the Get Last Sent State button, both under the Tic Tac Toe Adjudicator yellow box to check if the correct nonce or state is shwoing. If successful, then either player can Finalise Channel (under the Tic Tac Toe Adjudicator section) and the funds will be distributed accordingly. Now any interactions with the contract will throw up an error since the contract will have been terminated.

## What to do if...
##### You accidentally refresh the page and don't want to create a new contract everytime your slippery fingers press the refresh button by accident
If this happens, do not fret! You can simply choose to attach to existing contract right under where you created a new contract and the address of your most recent contract should be automatically filled in already for you!

##### Your opponent goes offline
If your opponent suddenly disappears with no signs of reappearing and you are left with an incomplete game, do not fear, all hope is not lost. If you were the last one to play, send in the most recent board with the Send Board option. If you are not the last one to play, sign a new board where you are the last one to play and send that board in. The default for an incomplete game is that the person who went last wins, so in this case you will win and your opponent will pay the disconnect and the adjudication penalty.

##### You go offline but come back before the timeout
If this is the case, you might be worried that you would be forced to pay both the disconnect and the adjudication penalty since you disconnected. This is not necessarily the case if you are able to reconnect before the timeout runs out. You can then use the check in option under the Tic Tac Toe Rules yellow box to notify both the contract and your opponent that you are back. If your opponent is willing, you can then continue the game exactly where you left off, or if your opponent is fed up with your disapperance, the channel can be closed right there and then, without you paying any penalties.

##### Your opponent goes twice and/or overwrites your move
If either of these two obviously invalid things happen, you can use the Bad Board Sent option under Tic Tac Toe Rules to send in both the invalid board and the last valid board. The immutable flag will then be raised and the state will no longer be mutable and the two of you will basically have no choice but to Finalise Channel.

If however, you understand that you will lose your adjudication deposit if you turn your opponent in for cheating, you may want to consider a different course of action. If you forgive your opponent (especially if it was an honest mistake) and do not use Bad Board Sent, the two of you may simply forget about the invalid board and continue playing thus saving both of you the pain of paying penalties.

##### You want to finalise the channel before the timeout has expired
If for some reason, the two of you set up an extremely large timeout period or if your game finished before the timeout expired, the two of you can still finalise channel without waiting around for no real reason. In order to do this, you must both give your consent to an early closeout by both clicking on the Give Consent button in the Tic Tac Toe Adjudicator yellow box. After both of you have clicked the button, either of you may press Finalise Channel and it should work as expected.

##### You want to kill the contract because you're a killer
This is a fairly easy task to perform. Both players must enter the address to which the funds of the contract is to be sent and click the Sign Kill button in the Signatures yellow box. The signatures and the recipient are then to be used to fill in the Send Kill form in the Tic Tac Toe Rules yellow box and once this option is used, the contract will effectively be no more.

##### You want to get rid of old data hanging out in your signature tables
Fixing this is very straightforward, simply refresh the web page and the table should be cleared of all data
