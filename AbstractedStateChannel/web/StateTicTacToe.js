if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var TicTacToeRules;
var TicTacToeAdjudicator;
var TicTacToeLockedState;

function sign(signingAddress, hash) {
	var signature = web3.eth.sign(signingAddress, hash);
	return [
		27 + Number(signature.slice(130, 132)),
		signature.slice(0, 66),
		'0x' + signature.slice(66, 130)
	];
}

function createTicTacToeRules(form) {
	TicTacToeRules = web3.eth.contract(TIC_TAC_TOE_RULES_INTERFACE).new(
		web3.eth.accounts[form.addressX.value],
		web3.eth.accounts[form.addressO.value],
		form.timeout.value,
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
				alert('Contract has been mined at: ' +contract.address);
			} else {
				alert('Contract transaction: ' +contract.transactionHash);
			}
		}
	);
}

function attachToContract(form) {
	TicTacToeRules = web3.eth.contract(TIC_TAC_TOE_RULES_INTERFACE).at(form.address.value);
	TicTacToeAdjudicator = web3.eth.contract(TIC_TAC_TOE_ADJUDICATOR_INTERFACE).at(TicTacToeRules.getAdjudicatorAddress());
	TicTacToeLockedState = web3.eth.contract(TIC_TAC_TOE_LOCKED_STATE_INTERFACE).at(TicTacToeAdjudicator.getLockedStateAddress());
	localStorage.setItem('address', form.address.value);
	alert("Attached to contract!");
}

function signState(form) {
	var state = ('00' + (
			parseInt(form.winner.value)
			| form.adjudicationDepositX.checked ? parseInt(form.adjudicationDepositX.value) : 0
			| form.adjudicationDepositO.checked ? parseInt(form.adjudicationDepositO.value) : 0
			| form.disconnectDepositX.checked ? parseInt(form.disconnectDepositX.value) : 0
			| form.disconnectDepositO.checked ? parseInt(form.disconnectDepositO.value) : 0
			| form.cheating.checked ? parseInt(form.cheating.value) : 0
		).toString(16)).slice(-2);

	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += parseInt(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+state
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

	$('#stateTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ '0x' +state
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

function signBoard(form) {
	var board = '';

	var boardElements = $(form).find('.boardItem');
	for (var i = 0; i < boardElements.length; i++) {
		board += ('00' + parseInt(boardElements[i].value).toString(16)).slice(-2);
	}
	board += ('00' + parseInt(form.lastPlayer.value).toString(16)).slice(-2);
	board.slice(-20);

	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += parseInt(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+board
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

	$('#boardTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ '0x' +board
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

function arrayOfStringsToNumbers(array) {
	for (var i = 0; i < array.length; i++) {
		array[i] = parseInt(array[i], 16);
	}
}

function sendState(form) {
	var rXArray = form.rX.value.match(/.{2}/g);
	var sXArray = form.sX.value.match(/.{2}/g);
	var rOArray = form.rO.value.match(/.{2}/g);
	var sOArray = form.sO.value.match(/.{2}/g);
	rXArray.splice(0, 1);
	sXArray.splice(0, 1);
	rOArray.splice(0, 1);
	sOArray.splice(0, 1);
	arrayOfStringsToNumbers(rXArray);
	arrayOfStringsToNumbers(sXArray);
	arrayOfStringsToNumbers(rOArray);
	arrayOfStringsToNumbers(sOArray);

	TicTacToeRules.sendState.sendTransaction(
			[parseInt(form.state.value, 16)],
			parseInt(form.nonce.value),
			parseInt(form.vX.value),
			rXArray,
			sXArray,
			parseInt(form.vO.value),
			rOArray,
			sOArray,
			{
				from: web3.eth.accounts[$('#sender').val()]
			}
		);
		alert('Call sent to blockchain.');
}

function getState(form) {
	alert(TicTacToeAdjudicator.getStateAt(0));
}

function getNonce(form) {
	alert(TicTacToeAdjudicator.getNonce());
}

function giveConsent(form) {
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
				from: web3.eth.accounts[$('#sender').val()]
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

function finaliseChannel(form) {
	TicTacToeAdjudicator.finaliseChannel.sendTransaction({
			from: web3.eth.accounts[$('#sender').val()]
	});
	alert('Call sent to blockchain.');
}

function depositFunds(form) {
	TicTacToeLockedState.deposit.sendTransaction(
			parseInt(form.account.value),
			{
				from: web3.eth.accounts[$('#sender').val()],
				value: form.amount.value
			}
		);
	alert('Call sent to blockchain.');
}

function getBalance(form) {
	alert(TicTacToeLockedState.getBalance(parseInt(form.account.value)));
}

$(document).ready(function () {
	// Populate address lists with addresses from web3.eth
	for (var i = 0; i < web3.eth.accounts.length; i++) {
		$('.addresses').append("<option value=\"" +i +"\">" +web3.eth.accounts[i] +"</option>");
	}

	// Persistent state
	if (localStorage.getItem('address')) {
		$('#existingContract input[name=address]').val(localStorage.getItem('address'));
	}

});
