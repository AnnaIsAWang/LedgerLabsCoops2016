const TIC_TAC_TOE_RULES_INTERFACE =
[{"constant":true,"inputs":[],"name":"getAdjudicatorAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"checkIn","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"board","type":"bytes10"},{"name":"nonce","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"sendBoard","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"state","type":"bytes"},{"name":"nonce","type":"uint256"},{"name":"vX","type":"uint8"},{"name":"rX","type":"bytes32"},{"name":"sX","type":"bytes32"},{"name":"vO","type":"uint8"},{"name":"rO","type":"bytes32"},{"name":"sO","type":"bytes32"}],"name":"sendState","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"oldBoard","type":"bytes10"},{"name":"oldNonce","type":"uint256"},{"name":"oldV","type":"uint8"},{"name":"oldR","type":"bytes32"},{"name":"oldS","type":"bytes32"},{"name":"newBoard","type":"bytes10"},{"name":"newNonce","type":"uint256"},{"name":"newV","type":"uint8"},{"name":"newR","type":"bytes32"},{"name":"newS","type":"bytes32"}],"name":"badBoardSent","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_addressX","type":"address"},{"name":"_addressO","type":"address"},{"name":"_timeout","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"state","type":"bytes"}],"name":"StateSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cheater","type":"address"}],"name":"Cheating","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"}],"name":"BoardWinner","type":"event"},{"anonymous":false,"inputs":[],"name":"CheckedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Adjudicator","type":"address"},{"indexed":false,"name":"LockedState","type":"address"}],"name":"StateChannelCreated","type":"event"}]
;

const TIC_TAC_TOE_ADJUDICATOR_INTERFACE =
[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"giveConsent","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getLockedStateAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getStateAt","outputs":[{"name":"","type":"bytes1"}],"type":"function"},{"constant":false,"inputs":[],"name":"finaliseChannel","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"requiredSignators","type":"uint256"},{"name":"data","type":"bytes"},{"name":"newNonce","type":"uint256"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"close","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"getNonce","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getStateLength","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[{"name":"addressX","type":"address"},{"name":"addressO","type":"address"},{"name":"_timeout","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"state","type":"bytes"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"CloseEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"state","type":"bytes"}],"name":"ChannelFinalised","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"consenter","type":"address"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"ConsentGiven","type":"event"}]
;

const TIC_TAC_TOE_LOCKED_STATE_INTERFACE =
[{"constant":true,"inputs":[{"name":"account","type":"uint256"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"state","type":"bytes"}],"name":"checkState","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"uint256"}],"name":"deposit","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"state","type":"bytes"}],"name":"broadcastState","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_addressX","type":"address"},{"name":"_addressO","type":"address"},{"name":"_burner","type":"address"}],"type":"constructor"}]
;

const CONTRACT_BYTECODE =
'6060604052604051606080613a62833981016040528080519060200190919080519060200190919080519060200190919050505b5b61003c6101f2565b600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055507f82f2376d5de11a1b42267103c972e12b5f3238e5f913ca8ecca46e4509dfc569600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663831121dc604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f1156100025750505060405180519060200150604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b82600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806003600050819055505b505050611fba806102ac6000396000f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003600050546040516117fc80612266833901808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050604051809103906000f0905080506003600050600090555b905660606040526000357c0100000000000000000000000000000000000000000000000000000000900480630d3cb40914610065578063183ff0851461009e57806349d463e6146100c3578063cdad5f9414610115578063d054cd871461018d57610063565b005b610072600480505061020c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100ab600480505061023b565b60405180821515815260200191505060405180910390f35b6100fd600480803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061040f565b60405180821515815260200191505060405180910390f35b6101756004808035906020019082018035906020019190919290803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190803590602001909190505061114b565b60405180821515815260200191505060405180910390f35b6101f460048080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506114b6565b60405180821515815260200191505060405180910390f35b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610238565b90565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663846e832d6000604051827c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001507f01000000000000000000000000000000000000000000000000000000000000009004905060006040821660ff1614158061031657506000603c821660ff16145b15610324576000915061040b565b6103c0600c60cf831617600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d087d288604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f1156100025750505060405180519060200150611cf6565b15610401577f064bebaa849d3e30322d194329ce821c642270e67dff2fc1b111b8a54ffdec2560405180905060405180910390a16001915061040b5661040a565b6000915061040b565b5b5090565b6000600060006000600060018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090041461047957601461047c565b60285b905060018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090041480156105e8575060018a8a30604051808475ffffffffffffffffffffffffffffffffffffffffffff19168152600a018381526020018273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019350505050604051809103902089898960405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f1156100025750506040518051906020015073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b80610759575060048a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f01000000000000000000000000000000000000000000000000000000000000009004148015610758575060018a8a30604051808475ffffffffffffffffffffffffffffffffffffffffffff19168152600a018381526020018273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019350505050604051809103902089898960405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f1156100025750506040518051906020015073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b5b1515610768576000945061113e565b6000935083505b6003841015610957576000915081506000925082505b60038310156107fc57896107998585611fa5565b600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090048201915081505b8280600101935050610785565b60036001028214156108a457610815600182178a611cf6565b15610896577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e5661089f565b6000945061113e565b610949565b6003600402821415610948576108bd600282178a611cf6565b1561093e577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610947565b6000945061113e565b5b5b5b838060010194505061076f565b6000925082505b6003831015610b46576000915081506000935083505b60038410156109eb57896109888585611fa5565b600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090048201915081505b8380600101945050610974565b6003600102821415610a9357610a04600182178a611cf6565b15610a85577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610a8e565b6000945061113e565b610b38565b6003600402821415610b3757610aac600282178a611cf6565b15610b2d577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610b36565b6000945061113e565b5b5b5b828060010193505061095e565b6000915081506000935083505b6003841015610bca5789610b678586611fa5565b600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090048201915081505b8380600101945050610b53565b6003600102821415610c7257610be3600182178a611cf6565b15610c64577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610c6d565b6000945061113e565b610d17565b6003600402821415610d1657610c8b600282178a611cf6565b15610d0c577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610d15565b6000945061113e565b5b5b6000915081506000935083505b6003841015610d9e5789610d3b8586600203611fa5565b600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090048201915081505b8380600101945050610d24565b6003600102821415610e4657610db7600182178a611cf6565b15610e38577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610e41565b6000945061113e565b610eeb565b6003600402821415610eea57610e5f600282178a611cf6565b15610ee0577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd674600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e56610ee9565b6000945061113e565b5b5b6000915081505b60098210156110e05760008a83600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414156110d257610fc560018b6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090048360ff161714610fbc576002610fbf565b60015b8a611cf6565b156110c8577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd67460018b6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090041461106c57600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001945061113e566110d1565b6000945061113e565b5b5b8180600101925050610ef2565b6110ea818a611cf6565b15611134577fbe22ba9c2eaed3523f970580aa0cd7ea2e68ca7d53c59f72a3d07e25d99cd67460006040518082815260200191505060405180910390a16001945061113e5661113d565b6000945061113e565b5b5050505095945050505050565b600060206040519081016040528060008152602001506020604051908101604052806000815260200150602060405190810160405280600081526020015060026040518059106111985750595b9080825280602002602001820160405250925060026040518059106111ba5750595b9080825280602002602001820160405250915060026040518059106111dc5750595b90808252806020026020018201604052509050898360008151811015610002579060200190602002019060ff16908181526020015050868360018151811015610002579060200190602002019060ff16908181526020015050888260008151811015610002579060200190602002019060001916908181526020015050858260018151811015610002579060200190602002019060001916908181526020015050878160008151811015610002579060200190602002019060001916908181526020015050848160018151811015610002579060200190602002019060001916908181526020015050600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663aaab51c960028f8f8f888888604051887c0100000000000000000000000000000000000000000000000000000000028152600401808881526020018060200186815260200180602001806020018060200185810385528b8b8281815260200192508082843782019150508581038452888181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050018581038352878181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050018581038252868181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019b5050505050505050505050506020604051808303816000876161da5a03f11561000257505050604051805190602001501561149c577f8a2e52d2bb14d6d27f80a7ca137613b8add6f60d796449aaf49acc21fdc820d48d8d604051808060200182810382528484828181526020019250808284378201915050935050505060405180910390a1600193506114a6566114a5565b600093506114a6565b5b5050509998505050505050505050565b60006000600060006001896009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090041461153f57600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611563565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b925060018e8e30604051808475ffffffffffffffffffffffffffffffffffffffffffff19168152600a018381526020018273ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401935050505060405180910390208d8d8d60405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f1156100025750506040518051906020015073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614801561174357506001898930604051808475ffffffffffffffffffffffffffffffffffffffffffff19168152600a018381526020018273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019350505050604051809103902088888860405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f1156100025750506040518051906020015073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b15156117525760009350611ce5565b60019150600090505b6009811015611b63578881600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168e82600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916141561180f57611b56565b60018982600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414806118be575060048982600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f01000000000000000000000000000000000000000000000000000000000000009004145b801561191a575060008e82600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f01000000000000000000000000000000000000000000000000000000000000009004145b80156119235750815b80156119cd5750886009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168982600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b156119dd57600091508150611b56565b611a4960018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414611a4057606d611a43565b605e5b89611cf6565b15611b4c577fda4bb02b98f815347f6f24e4c1181df6c93c3765350d7a0b76a43fd7b5f72e5c60018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414611af057600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611b14565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a160019350611ce556611b55565b60009350611ce5565b5b808060010191505061175b565b818015611bd85750611bd760018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414611bce57606d611bd1565b605e5b89611cf6565b5b15611cdb577fda4bb02b98f815347f6f24e4c1181df6c93c3765350d7a0b76a43fd7b5f72e5c60018a6009600a811015610002571a7f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900414611c7f57600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611ca3565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a160019350611ce556611ce4565b60009350611ce5565b5b5050509a9950505050505050505050565b600060206040519081016040528060008152602001506001604051805910611d1b5750595b90808252806020026020018201604052509050837f0100000000000000000000000000000000000000000000000000000000000000028160008151811015610002579060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663aaab51c9600083866001604051805910611dde5750595b90808252806020026020018201604052506001604051805910611dfe5750595b90808252806020026020018201604052506001604051805910611e1e5750595b9080825280602002602001820160405250604051877c0100000000000000000000000000000000000000000000000000000000028152600401808781526020018060200186815260200180602001806020018060200185810385528a8181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015611ecc5780820380516001836020036101000a031916815260200191505b508581038452888181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050018581038352878181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050018581038252868181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019a50505050505050505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150505b5092915050565b60008160030283019050611fb4565b92915050566060604052600060056000505560006006600050556040516060806117fc833981016040528080519060200190919080519060200190919080519060200190919050505b60026040518059106100525750595b90808252806020026020018201604052506002825b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8260026000509080519060200190828054828255906000526020600020908101928215610105579160200282015b828111156101045782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550916020019190600101906100c2565b5b50905061014c9190610112565b8082111561014857600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101610112565b5090565b5050816003600050819055508060046000508190555061016a610234565b600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5050508260026000506000815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508160026000506001815481101561000257906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b505050610cc4806103176000396000f35b600060026000506000815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660026000506001815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060405161082180610fdb833901808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050604051809103906000f09050610314565b90566060604052361561008a576000357c01000000000000000000000000000000000000000000000000000000009004806341c0e1b51461008c5780635f2e0c201461009b578063831121dc146100c5578063846e832d146100fe5780638fae48571461014c578063aaab51c914610171578063d087d288146101f8578063f09649ed1461021b5761008a565b005b610099600480505061023e565b005b6100c3600480803590602001909190803590602001909190803590602001909190505061035f565b005b6100d260048050506104c0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61011460048080359060200190919050506104ef565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b610159600480505061058f565b60405180821515815260200191505060405180910390f35b6101e06004808035906020019091908035906020019082018035906020019190919290803590602001909190803590602001908201803590602001919091929080359060200190820180359060200191909192908035906020019082018035906020019190919290505061069b565b60405180821515815260200191505060405180910390f35b6102056004805050610a93565b6040518082815260200191505060405180910390f35b6102286004805050610aa5565b6040518082815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561029e576100025661035c565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166341c0e1b5604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506000604051808303816000876161da5a03f11561000257505050600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b60006001600560005054600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808381526020018273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140192505050604051809103902085858560405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f115610002575050604051805190602001509050600560005054600860005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055507fad0374cf3b26efb1966569e3d14388471df465853022ffce35aee2ef27796ece81600560005054604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b50505050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506104ec565b90565b6000600760005080546001816001161561010002031660029004905082101561058457600760005082815460018160011615610100020316600290048110156100025790908154600116156105535790600052602060002090602091828204019190065b9054901a7f010000000000000000000000000000000000000000000000000000000000000002905061058a56610589565b610002565b5b919050565b60006000600060006006600050541180156105b557504260046000505460066000505401105b156105c9576105c2610acb565b9250610696565b60009150600090505b60026000508054905081101561068d5760056000505460086000506000600260005084815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505414156106625781806001019250505b6003600050548210151561067f57610678610acb565b9250610696565b5b80806001019150506105d2565b60009250610696565b505090565b6000600060006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107035761000256610a81565b6005600050548b118061072657506005600050548b148015610725575060008e145b5b15610a77578c8c8c600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518085858082843782019150508381526020018273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019450505050506040518091039020925060009150600090505b600260005080549050811015610a6a576001838b8b8481811015610002579050909060200201358a8a858181101561000257905090906020020135898986818110156100025790509090602002013560405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051808303816000866161da5a03f1156100025750506040518051906020015073ffffffffffffffffffffffffffffffffffffffff16600260005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156108c45781806001019250505b8d82101515610a5c578a600560005081905550426006600050819055508c8c60076000509190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061092b57803560ff191683800117855561095c565b8280016001018555821561095c579182015b8281111561095b57823582600050559160200191906001019061093d565b5b5090506109879190610969565b808211156109835760008181506000905550600101610969565b5090565b50507f2164d8d622eaf94cdeb2c8e818dcce11c658e336dbf96ea9558bf5601a2c17f360076000506005600050546040518080602001838152602001828103825284818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610a445780601f10610a1957610100808354040283529160200191610a44565b820191906000526020600020905b815481529060010190602001808311610a2757829003601f168201915b5050935050505060405180910390a160019350610a82565b5b80806001019150506107aa565b60009350610a8256610a80565b60009350610a82565b5b5b5050509a9950505050505050505050565b60006005600050549050610aa2565b90565b600060076000508054600181600116156101000203166002900490509050610ac8565b90565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd2a7a616007600050604051827c01000000000000000000000000000000000000000000000000000000000281526004018080602001828103825283818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610bbe5780601f10610b9357610100808354040283529160200191610bbe565b820191906000526020600020905b815481529060010190602001808311610ba157829003601f168201915b5050925050506020604051808303816000876161da5a03f115610002575050506040518051906020015015610cb7577f1c11cf190a5e4a6af2e501b1459e20bfb10dd3ec183c5a11570c883e4f0a8a6160076000506040518080602001828103825283818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610c9c5780601f10610c7157610100808354040283529160200191610c9c565b820191906000526020600020905b815481529060010190602001808311610c7f57829003601f168201915b50509250505060405180910390a160019050610cc156610cc0565b60009050610cc1565b5b90566060604052604051606080610821833981016040528080519060200190919080519060200190919080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b82600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50505061072e806100f36000396000f360606040523615610069576000357c0100000000000000000000000000000000000000000000000000000000900480631e010439146100765780633660943d146100a257806341c0e1b51461010e578063b6b55f251461011d578063cd2a7a611461013557610069565b6100745b610002565b565b005b61008c600480803590602001909190505061016e565b6040518082815260200191505060405180910390f35b6100f66004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506101a7565b60405180821515815260200191505060405180910390f35b61011b6004805050610251565b005b61013360048080359060200190919050506102ef565b005b6101566004808035906020019082018035906020019190919290505061032a565b60405180821515815260200191505060405180910390f35b600060068210151561018357610002566101a1565b60046000508260068110156100025790900160005b505490506101a2565b5b919050565b600060018251141561024257600360038360008151811015610002579060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f010000000000000000000000000000000000000000000000000000000000000090041660ff161415905061024c5661024b565b6000905061024c565b5b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102b157610002566102ec565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b6006811015156103025761000256610326565b3460046000508260068110156100025790900160005b828282505401925050819055505b5b50565b6000600060006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103925761000256610724565b6103cd86868080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050506101a7565b15156103dc5760009350610725565b600092506000915085856000818110156100025790509001357f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f01000000000000000000000000000000000000000000000000000000000000009004905060016003821614156104a7576004600050600160068110156100025790900160005b50546004600050600060068110156100025790900160005b50540183019250825061052d565b60026003821614156104ef576004600050600160068110156100025790900160005b50546004600050600060068110156100025790900160005b50540182019150815061052c565b6004600050600060068110156100025790900160005b50548301925082506004600050600160068110156100025790900160005b50548201915081505b5b6000601082161461053f576000610558565b6004600050600460068110156100025790900160005b50545b6000600483161461056a576000610583565b6004600050600260068110156100025790900160005b50545b018301925082506000602082161461059c5760006105b5565b6004600050600560068110156100025790900160005b50545b600060088316146105c75760006105e0565b6004600050600360068110156100025790900160005b50545b01820191508150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600084604051809050600060405180830381858888f19350505050151561064657610002565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600083604051809050600060405180830381858888f1935050505015156106a557610002565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050151561071b57610002565b60019350610725565b5b5050509291505056';
