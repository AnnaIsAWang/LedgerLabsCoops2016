# Abstracted State Channel Documentation

Warning, this repository is deprecated. For the most up-to-date state channel abstraction, check out [this](https://github.com/ledgerlabs/toy-state-channels).

### Overview
A common concern that crosses people’s minds when they think about blockchain technology and [Ethereum](ethereum.org) is the issue of scalibility. How is it going to be possible for 7.1 billion people to effectively use a decentralized platform such as Ethereum without constantly crashing the system with excessive traffic? One of many solutions is the introduction of State Channels, essentially a generalized version of [Payment Channels](https://en.bitcoin.it/wiki/Payment_channels) in Bitcoin. The State Channel implementation presented here is abstracted in a way that it can be used for a plethora of different purposes.

Currently this implementation of State Channels allows an arbitrary number of users to create and destroy a channel, enables a wide array of uses for the channel, permits Power of Attorney to a non-participating party, and provides a strong economic incentive system to discourage malicious behaviour. Future aspirations include encorporating a 'Fulfillment of Commitment' layer of abstraction (basically allowing conditional transactions) and permitting State Channels to simultaneously handle a plethora of different applications.

### Layers of Abstraction
The Abstracted State Channel (ASC) implemented here is currently broken down into three different levels of abstraction.

#### Level 1: A locked state
The locked state is a state of matters that the State Channel starts out as with the consent of all the participants in the State Channel. Often times, the locked state includes some sort of deposit from the participants used as an incentive mechanism to dissuade dishonest behaviour. 

Examples of a locked state are Alice puts up 50 ethers in order to give Bob micropayments, Alice and Bob both bet 10 ethers on a tic tac toe game, etc. 

#### Level 2: An adjudicator
In an ideal world, the adjudicator is never called upon. Since calling the adjudicator is interacting with the blockchain (and hence, expensive), it is not logical to call the adjudicator unless there is an absolute need to. Since the adjudicator is a programmed Smart Contract, its intolerance for dishonest behaviour is incorruptable and simply the threat of going to the adjudicator should provide incentive to act honestly.

An adjudicator can be thought of a court judge who enforces the rules. Similar to disputes in the 'real world', most of the time, parties are only willing to pay the legal fees to get a court hearing if there is a dispute that cannot be resolved. 

#### Level 3: Rules definition
Rules specific to the current usage of the State Channel are the next level of abstraction. Since the rules are written up and maintained by a Smart Contract, interactions on State Channels are able to be transparent while protecting the privacy of its users.

### An Example of How to Use Abstracted State Channels
This directory includes a game of tic tac toe implemented on the ASC. Essentially, the tic tac toe game has its own Smart Contracts for each of the layer of abstraction stated above that inherit from the ASC Smart Contracts. Warning: it may be beneficial to read up on embedded programming before reading the code for the tic tac toe example.

### References
Anna's understanding of Denton's brain
