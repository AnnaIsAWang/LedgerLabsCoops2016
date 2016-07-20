"use strict";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

    function getWeb3Promise(method) {
        var params = Array.prototype.slice.call(arguments, 1);
        return new Promise(function(resolve, reject) {
            params.push(function(error, result) {
                if (error) {
                    self.emit('web3Error', wrapError(error));
                    return reject(error);
                }
                resolve(result);
            });
            web3.eth[method].apply(web3, params);
        });
    }

function tests() {
	createContractSimulation(1).then(function() {
		return sendStateSimulation(1, "0x00", 1);
	}).then(function() {
		return depositFundsSimulation(1, 0);
	}).then(function() {
		return sendBoardSimulation(2, "0x01000000000000000001", 1, 0);
	}).then(function() {
		return sendBoardSimulation(3, "0x04000000000000000004", 2, 1);
	}).then(function() {
		return badBoardSentSimulation(2, "0x01000000000000000001", 3, "0x04000000000000000004", 2, 1);
	}).then(function() {
		return sendStateSimulation(4, "0x30", 2);
	}).then(function() {
		return checkInSimulation(0);
	}).then(function() {
		return finaliseChannelSimulation();
	}).then(function() {
		killSimulation(web3.eth.accounts[0], 1);
	});
}

function createContractSimulation(timeout) {
	$('select[name=addressX]').val(0);
	$('select[name=addressO]').val(1);
	$('input[name=timeout]').val(timeout);
	return new Promise(function(resolve, reject) {
		TicTacToeRules = web3.eth.contract(TIC_TAC_TOE_RULES_INTERFACE).new(
			web3.eth.accounts[0],
			web3.eth.accounts[1],
			timeout,
			{
				from: web3.eth.accounts[$('#sender').val()],
				data: CONTRACT_BYTECODE,
				gas: 4700000
			}, function (e, contract) {
				if (typeof contract.address !== 'undefined') {
					TicTacToeAdjudicator = web3.eth.contract(TIC_TAC_TOE_ADJUDICATOR_INTERFACE).at(contract.getAdjudicatorAddress());
					TicTacToeLockedState = web3.eth.contract(TIC_TAC_TOE_LOCKED_STATE_INTERFACE).at(TicTacToeAdjudicator.getLockedStateAddress());
					$('#existingContract input[name=address]').val(contract.address);
					localStorage.setItem('address', contract.address);
					console.log("Contract Mined at: " + contract.address);
					resolve(contract);
				} 
			}
		);
	});
}

function attach() {
	$('#attach').click();
}

function sendStateSimulation(nonce, state, number) {
	var backup = state;
	state = (parseInt(state)).toString(10);
	if (state >= 64 && !($('input[name=immutable]')[0].checked)) {
		$('input[name=immutable]').click();
		state -= 64;
	} else if (state >= 64) {
		state -= 64;
	} else if ($('input[name=immutable]')[0].checked) {
		$('input[name=immutable]').click();
	}
	
	if (state >= 32 && !($('input[name=disconnectDepositO]')[0].checked)) {
		$('input[name=disconnectDepositO]').click();
		state -= 32;
	} else if (state >= 32) {
		state -= 32;
	} else if ($('input[name=disconnectDepositO]')[0].checked) {
		$('input[name=disconnectDepositO]').click();
	}
	
	if (state >= 16 && !($('input[name=disconnectDepositX]')[0].checked)) {
		$('input[name=disconnectDepositX]').click();
		state -= 16;
	} else if (state >= 16) {
		state -= 16;
	} else if ($('input[name=disconnectDepositX]')[0].checked) {
		$('input[name=disconnectDepositX]').click();
	}
	
	if (state >= 8 && !($('input[name=adjudicationDepositO]')[0].checked)) {
		$('input[name=adjudicationDepositO]').click();
		state -= 8;
	} else if (state >= 8) {
		state -= 8;
	} else if ($('input[name=adjudicationDepositO]')[0].checked) {
		$('input[name=adjudicationDepositO]').click();
	}
	
	if (state >= 4 && !($('input[name=adjudicationDepositX]')[0].checked)) {
		$('input[name=adjudicationDepositX]').click();
		state -= 4;
	} else if (state >= 4) {
		state -= 4;
	} else if ($('input[name=adjudicationDepositX]')[0].checked) {
		$('input[name=adjudicationDepositX]').click();
	}
	
	// At this point, state should never be 0x03 since both players cannot win
	if (state == 2) {
		$('input[name=winner]:nth-child(5)').click();
	} else if (state == 1) {
		$('input[name=winner]:nth-child(4)').click();
	} else {
		$('input[name=winner]:nth-child(3)').click();
	}
	
	$('#stateNonce').val(nonce);
	
	$('#sender').val(0);
	$('#SignTheState').click();
	$('#sender').val(1);
	$('#SignTheState').click();

	$('input[name=state]').val(backup);
	$('#sendStateNonce').val(nonce);
	
	var value = parseInt(document.getElementById("stateTable").rows[2 * number - 1].cells[3].innerHTML);
	$('input[name=vX]:first').val(value);
	value = document.getElementById("stateTable").rows[2 * number - 1].cells[4].innerHTML;
	$('input[name=rX]:first').val(value);
	value = document.getElementById("stateTable").rows[2 * number - 1].cells[5].innerHTML;
	$('input[name=sX]:first').val(value);
	
	value = parseInt(document.getElementById("stateTable").rows[2 * number].cells[3].innerHTML);
	$('input[name=vO]:first').val(value);
	value = (document.getElementById("stateTable").rows[2 * number].cells[4].innerHTML);
	$('input[name=rO]:first').val(value);
	value = (document.getElementById("stateTable").rows[2 * number].cells[5].innerHTML);
	$('input[name=sO]:first').val(value);
	
	var form = document.forms["sendState"];
	
	return new Promise(function (resolve, reject) {
		TicTacToeRules.sendState.sendTransaction(
			form.state.value,
			parseInt(form.nonce.value),
			parseInt(form.vX.value),
			form.rX.value,
			form.sX.value,
			parseInt(form.vO.value),
			form.rO.value,
			form.sO.value,
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000,
			}, function (err, result) {
			 	if (err) {
            				console.error(err);
            				return;
        			}
				var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
            					if (receipt.logs.length < 2) {
            						console.log("Nonce: " + nonce + " || State sent: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Nonce: " + nonce + " || State sent: " + (receipt.logs[1].topics[0] == web3.sha3("StateSent(bytes)")));
                				filter.stopWatching();
            				}
            				resolve(result);
        			});
			});
		});
	
}

function sendBoardSimulation(nonce, board, number, signer) {
	$('#sender').val(signer);
	var backup = board;
	board = board.slice(-20);
	var squares = [];
	for (var i = 0; i < 20; i += 2) {
		var entry = board[i] + board[i + 1];
		entry = parseInt(entry);
		squares.push(entry);
	}
	
	var boardElements = $('#board').find('.boardItem');
	for (var j = 0; j < 9; ++j) {
		boardElements[j].value = squares[j];
	}
	
	if (squares[9] == 1) {
		$('input[name=lastPlayer]:nth-child(5)').click();
	} else if (squares[9] == 4) {
		$('input[name=lastPlayer]:nth-child(6)').click();
	}
	
	$('#boardNonce').val(nonce);
	$('#SignTheBoard').click();
	
	$('input[name="board"]').val(backup);
	$('#sendBoardNonce').val(nonce);
	var value = parseInt(document.getElementById('boardTable').rows[number].cells[3].innerHTML);
	$('input[name="v"]').val(value);
	value = document.getElementById('boardTable').rows[number].cells[4].innerHTML;
	$('input[name="r"]').val(value);
	value = document.getElementById('boardTable').rows[number].cells[5].innerHTML;
	$('input[name="s"]').val(value);
	
	var form = document.forms["sendBoard"];
	return new Promise(function(resolve, reject) {
		TicTacToeRules.sendBoard.sendTransaction(
			form.board.value,
			parseInt(form.nonce.value),
			parseInt(form.v.value),
			form.r.value,
			form.s.value,
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
				var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
                				if (receipt.logs.length < 1) {
            						console.log("Nonce: " + nonce + " || Board sent: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Nonce: " + nonce + " || Board sent: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                				filter.stopWatching();
            				}
            				resolve(result);
        			});
			}); 		
		});
}

function badBoardSentSimulation(oldNonce, oldBoard, newNonce, newBoard, number, suspect) {
	$('#sender').val(suspect);
	
	var oldBackup = oldBoard;
	oldBoard = oldBoard.slice(-20);
	var oldSquares = [];
	for (var i = 0; i < 20; i += 2) {
		var entry = oldBoard[i] + oldBoard[i + 1];
		entry = parseInt(entry);
		oldSquares.push(entry);
	}
	
	var boardElements = $('#board').find('.boardItem');
	for (var j = 0; j < 9; ++j) {
		boardElements[j].value = oldSquares[j];
	}
	
	if (oldSquares[9] == 1) {
		$('input[name=lastPlayer]:nth-child(5)').click();
	} else if (oldSquares[9] == 4) {
		$('input[name=lastPlayer]:nth-child(6)').click();
	}
	
	$('#boardNonce').val(oldNonce);
	$('#SignTheBoard').click();
	
	var newBackup = newBoard;
	newBoard = newBoard.slice(-20);
	var newSquares = [];
	for (var k = 0; k < 20; k += 2) {
		var entry = newBoard[k] + newBoard[k + 1];
		entry = parseInt(entry);
		newSquares.push(entry);
	}
	
	boardElements = $('#board').find('.boardItem');
	for (var m = 0; m < 9; ++m) {
		boardElements[m].value = newSquares[m];
	}
	
	if (newSquares[9] == 1) {
		$('input[name=lastPlayer]:nth-child(5)').click();
	} else if (newSquares[9] == 4) {
		$('input[name=lastPlayer]:nth-child(6)').click();
	}
	
	$('#boardNonce').val(newNonce);
	$('#SignTheBoard').click();
	
	$('input[name="oldBoard"]').val(oldBackup);
	$('input[name="oldNonce"]').val(oldNonce);
	var value = parseInt(document.getElementById('boardTable').rows[2 * number - 1].cells[3].innerHTML);
	$('input[name="oldV"]').val(value);
	value = document.getElementById('boardTable').rows[2 * number - 1].cells[4].innerHTML;
	$('input[name="oldR"]').val(value);
	value = document.getElementById('boardTable').rows[2 * number - 1].cells[5].innerHTML;
	$('input[name="oldS"]').val(value);
	
	$('input[name="newBoard"]').val(newBackup);
	$('input[name="newNonce"]').val(newNonce);
	value = parseInt(document.getElementById('boardTable').rows[2 * number].cells[3].innerHTML);
	$('input[name="newV"]').val(value);
	value = document.getElementById('boardTable').rows[2 * number].cells[4].innerHTML;
	$('input[name="newR"]').val(value);
	value = document.getElementById('boardTable').rows[2 * number].cells[5].innerHTML;
	$('input[name="newS"]').val(value);
	
	var form = document.forms["badBoardSent"];
	var currentState = TicTacToeAdjudicator.getStateAt(0);
	// Check if cheating already occured
	if (currentState == '0x5E' || currentState == '0x6D') {
		console.log("Bad Board Sent: false");
		return false;
	}
	
	return new Promise(function (resolve, reject) {
		TicTacToeRules.badBoardSent.sendTransaction(
			form.oldBoard.value,
			parseInt(form.oldNonce.value),
			parseInt(form.oldV.value),
			form.oldR.value,
			form.oldS.value,
			form.newBoard.value,
			parseInt(form.newNonce.value),
			parseInt(form.newV.value),
			form.newR.value,
			form.newS.value,
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
				var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
                				if (receipt.logs.length < 1) {
            						console.log("Nonce: " + nonce + " || State sent: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Bad Board sent: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                				filter.stopWatching();
            				}
            				resolve(result);
        			});
			}); 		
		});
}

function checkInSimulation(player) {
	$('#sender').val(player);
	
	var currentState = TicTacToeAdjudicator.getStateAt(0);
	return new Promise(function(resolve, reject) {
		TicTacToeRules.checkIn.sendTransaction(
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
        			var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
            					if (receipt.logs.length < 1) {
            						console.log("Check In: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Check In: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                				filter.stopWatching();
            				}
            				resolve(result);
				});
        		});
		});
}

function killSimulation(recipient, number) {
	// Check for Killed(address) event
	$('input[name=recipient]').val(recipient);
	$('#sender').val(0);
	$('#SignTheKill').click();
	$('#sender').val(1);
	$('#SignTheKill').click();
	
	var value = parseInt(document.getElementById("killTable").rows[2 * number - 1].cells[2].innerHTML);
	$('input[name=vX]:last').val(value);
	value = document.getElementById("killTable").rows[2 * number - 1].cells[3].innerHTML;
	$('input[name=rX]:last').val(value);
	value = document.getElementById("killTable").rows[2 * number - 1].cells[4].innerHTML;
	$('input[name=sX]:last').val(value);
	
	value = parseInt(document.getElementById("killTable").rows[2 * number].cells[2].innerHTML);
	$('input[name=vO]:last').val(value);
	value = (document.getElementById("killTable").rows[2 * number].cells[3].innerHTML);
	$('input[name=rO]:last').val(value);
	value = (document.getElementById("killTable").rows[2 * number].cells[4].innerHTML);
	$('input[name=sO]:last').val(value);
	
	var form = document.forms["kill"];
	return new Promise(function(resolve, reject) {
		TicTacToeRules.kill.sendTransaction(
			form.recipient.value,
			parseInt(form.vX.value),
			form.rX.value,
			form.sX.value,
			parseInt(form.vO.value),
			form.rO.value,
			form.sO.value,
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
        			var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            					if (receipt && receipt.transactionHash == txhash) {
            						if (receipt.logs.length < 1) {
            							console.log("Kill: false");
            							filter.stopWatching();
            							return;
            					}
            					console.log("Kill: " + (receipt.logs[0].topics[0] == web3.sha3("Killed(address)")));
                				filter.stopWatching();
            				}
            				resolve(result);	
				});
        		});
		});
}

function giveConsentSimulation(nonce) {
	$('#consentNonce').val(nonce);
	var form = document.forms['consent'];
	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += parseInt(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));
	
	$('#consentTable').append('<tr><td>'
		+ web3.eth.accounts[$('#sender').val()]
		+ '</td><td>'
		+ form.nonce.value
		+ '</td><td>'
		+ signature[0]
		+ '</td><td>'
		+ signature[1]
		+ '</td><td>'
		+ signature[2]
	);

	return new Promise(function(resolve, reject) {
		TicTacToeAdjudicator.giveConsent.sendTransaction(
			signature[0],
			signature[1],
			signature[2],
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
        			var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
            					if (receipt.logs.length < 1) {
            						console.log("Consent: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Consent: " + (receipt.logs[0].topics[0] == web3.sha3("ConsentGiven(address,uint256)")));
                				filter.stopWatching();
            				}
            				resolve(result);
				});
        		});
		});
}

function finaliseChannelSimulation() {
	return new Promise(function(resolve, reject) {
		TicTacToeAdjudicator.finaliseChannel.sendTransaction(
			{
				from: web3.eth.accounts[$('#sender').val()],
				gas: 4700000
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
        			var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
            					if (receipt.logs.length < 1) {
            						console.log("Finalise Channel: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Finalise Channel: " + (receipt.logs[0].topics[0] == web3.sha3("ChannelFinalised(bytes)")));
                				filter.stopWatching();
            				}
            				resolve(result);
				});
        		});
		});
}

function depositFundsSimulation(amount, account) {
	$('input[name=amount]').val(amount);
	$('input[name=account]:nth-child(' + (2 * account + 5) + ')').click();
	
	var form = document.forms['deposit'];
	return new Promise(function(resolve, reject) {
		TicTacToeLockedState.deposit.sendTransaction(
			parseInt(form.account.value),
			{
				from: web3.eth.accounts[$('#sender').val()],
				value: form.amount.value
			}, function (err, result) {
				if (err) {
            				console.error(err);
            				return;
        			}
        			var txhash = result;
        			var filter = web3.eth.filter('latest');
        			filter.watch(function (error, result) {
            				var receipt = web3.eth.getTransactionReceipt(txhash);
            				if (receipt && receipt.transactionHash == txhash) {
            					if (receipt.logs.length < 1) {
            						console.log("Deposit: false");
            						filter.stopWatching();
            						return;
            					}
            					console.log("Deposit: " + (receipt.logs[0].topics[0] == web3.sha3("Deposited(uint256)")));
                				filter.stopWatching();
            				}
            				resolve(result);
				});
        		});
		});
}
