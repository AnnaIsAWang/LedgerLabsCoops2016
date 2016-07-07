if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function tests() {
	// createContractSimulation();
	attach();
	// sendStateSimulation(1, "0x2a", 1);
	// sendBoardSimulation(2, "0x01000000000000000001", 1);
	// badBoardSentSimulation(3, "0x01000000000000000001", 4, "0x04000000000000000004", 1, 1);
	// sendStateSimulation(5, "0x30", 1);
	// checkInSimulation(0);
	// killSimulation(web3.eth.accounts[0], 1);
	// giveConsentSimulation(6);
	// finaliseChannelSimulation();
	// depositFundsSimulation(1, 0);
}

function createContractSimulation() {
	$('select[name=addressX]').val(0);
	$('select[name=addressO]').val(1);
	$('input[name=timeout]').val(1);
	$('#createContract').click();
}

function attach() {
	$('#attach').click();
}

function sendStateSimulation(nonce, state, number) {
	var backup = state;
	state = (parseInt(state)).toString(10);
	if (state >= 64) {
		$('input[name=immutable]').click();
		state -= 64;
	}
	if (state >= 32) {
		$('input[name=disconnectDepositO]').click();
		state -= 32;
	}
	if (state >= 16) {
		$('input[name=disconnectDepositX]').click();
		state -= 16;
	}
	if (state >= 8) {
		$('input[name=adjudicationDepositO]').click();
		state -= 8;
	}
	if (state >= 4) {
		$('input[name=adjudicationDepositX]').click();
		state -= 4;
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
	
	var count = 0;
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
				gas: 4700000
			}, function (err, result) {
			 	if (err) {
            		console.error(err);
            		return;
        		}
				txhash = result;
        		filter = web3.eth.filter('latest');
        		filter.watch(function (error, result) {
            		var receipt = web3.eth.getTransactionReceipt(txhash);
            		if (receipt && receipt.transactionHash == txhash && count < 1) {
            			if (receipt.logs.length < 2) {
            				console.log("Nonce: " + nonce + " || State sent: false");
            				filter.stopWatching();
            				return;
            			}
            			console.log("Nonce: " + nonce + " || State sent: " + (receipt.logs[1].topics[0] == web3.sha3("StateSent(bytes)")));
                		++count;
                		filter.stopWatching();
            		}
        		});
			}
		);
	
}

function sendBoardSimulation(nonce, board, number) {
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
	var count = 0;
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
			txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
                	if (receipt.logs.length < 1) {
            				console.log("Nonce: " + nonce + " || State sent: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Nonce: " + nonce + " || Board sent: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                	++count;
                	filter.stopWatching();
            	}
        	});
		} 		
	);
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
	var count = 0;
	var currentState = TicTacToeAdjudicator.getStateAt(0);
	// Check if cheating already occured
	if (currentState == '0x5E' || currentState == '0x6D') {
		console.log("Bad Board Sent: false");
		return false;
	}
	
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
			txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
                	if (receipt.logs.length < 1) {
            				console.log("Nonce: " + nonce + " || State sent: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Bad Board sent: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                	++count;
                	filter.stopWatching();
            	}
        	});
		} 		
	);
}

function checkInSimulation(player) {
	$('#sender').val(player);
	
	var currentState = TicTacToeAdjudicator.getStateAt(0);
	var count = 0;
	TicTacToeRules.checkIn.sendTransaction(
		{
			from: web3.eth.accounts[$('#sender').val()],
			gas: 4700000
		}, function (err, result) {
			 if (err) {
            	console.error(err);
            	return;
        	}
        	txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
            		if (receipt.logs.length < 1) {
            				console.log("Check In: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Check In: " + (receipt.logs[0].topics[0] == web3.sha3("CloseEvent(bytes,uint256)")));
                	++count;
                	filter.stopWatching();
            	}
			});
        }
	);
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
	var count = 0;
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
        	txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
            		if (receipt.logs.length < 1) {
            				console.log("Kill: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Kill: " + (receipt.logs[0].topics[0] == web3.sha3("Killed(address)")));
                	++count;
                	filter.stopWatching();
            	}
			});
        }
	);
}

function giveConsentSimulation(nonce) {
	$('#consentNonce').val(nonce);
	var form = document.forms['consent'];
	var count = 0;
	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += parseInt(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

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
        	txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
            		if (receipt.logs.length < 1) {
            				console.log("Consent: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Consent: " + (receipt.logs[0].topics[0] == web3.sha3("ConsentGiven(address,uint256)")));
                	++count;
                	filter.stopWatching();
            	}
			});
        }
	);

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
}

function finaliseChannelSimulation() {
	var count = 0;
	TicTacToeAdjudicator.finaliseChannel.sendTransaction(
		{
			from: web3.eth.accounts[$('#sender').val()],
			gas: 4700000
		}, function (err, result) {
			 if (err) {
            	console.error(err);
            	return;
        	}
        	txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
            		if (receipt.logs.length < 1) {
            				console.log("Finalise Channel: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Finalise Channel: " + (receipt.logs[0].topics[0] == web3.sha3("ChannelFinalised(bytes)")));
                	++count;
                	filter.stopWatching();
            	}
			});
        }
	);
}

function depositFundsSimulation(amount, account) {
	$('input[name=amount]').val(amount);
	$('input[name=account]:nth-child(' + (2 * account + 5) + ')').click();
	
	var form = document.forms['deposit'];
	var count = 0;
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
        	txhash = result;
        	filter = web3.eth.filter('latest');
        	filter.watch(function (error, result) {
            	var receipt = web3.eth.getTransactionReceipt(txhash);
            	if (receipt && receipt.transactionHash == txhash && count < 1) {
            		if (receipt.logs.length < 1) {
            				console.log("Deposit: false");
            				filter.stopWatching();
            				return;
            			}
            		console.log("Deposit: " + (receipt.logs[0].topics[0] == web3.sha3("Deposited(uint256)")));
                	++count;
                	filter.stopWatching();
            	}
			});
        }
	);
}
