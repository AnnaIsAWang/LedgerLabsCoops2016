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
				alert('Contract has been mined at:' +contract.address);
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
	var state = '00' + (
			new Number(form.winner.value)
			| new Number(form.adjudicationDepositX.checked ? form.adjudicationDepositX.value : 0)
			| new Number(form.adjudicationDepositO.checked ? form.adjudicationDepositO.value : 0)
			| new Number(form.disconnectDepositX.checked ? form.disconnectDepositX.value : 0)
			| new Number(form.disconnectDepositO.checked ? form.disconnectDepositO.value : 0)
			| new Number(form.cheating.checked ? form.cheating.value : 0)
		).toString(16);

	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += new Number(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+state.slice(-2)
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

	$('#stateTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ state
			+ '</td><td>'
			+ form.nonce.value
			+ '</td><td>'
			+ TicTacToeRules.address
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
		board += ('00' + new Number(boardElements[i].value).toString(16)).slice(-2);
	}
	board += ('00' + new Number(form.lastPlayer.value).toString(16)).slice(-2);

	var nonce = '';
	for (var i = 0; i < 64; i++) {
		nonce += '0';
	}
	nonce += new Number(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+board.slice(-20)
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

	$('#boardTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ board
			+ '</td><td>'
			+ form.nonce.value
			+ '</td><td>'
			+ TicTacToeRules.address
			+ '</td><td>'
			+ signature[0]
			+ '</td><td>'
			+ signature[1]
			+ '</td><td>'
			+ signature[2]
		);
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
	nonce += new Number(form.nonce.value).toString(16);

	var toBeHashed = '0x'
		+nonce.slice(-64)
		+TicTacToeRules.address.slice(2);

	var signature = sign(web3.eth.accounts[$('#sender').val()], web3.sha3(toBeHashed, {encoding: 'hex'}));

	$('#consentTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ form.nonce.value
			+ '</td><td>'
			+ TicTacToeRules.address
			+ '</td><td>'
			+ signature[0]
			+ '</td><td>'
			+ signature[1]
			+ '</td><td>'
			+ signature[2]
		);
}

function depositFunds(form) {
	TicTacToeLockedState.deposit.sendTransaction(
			new Number(form.account.value),
			{
				from: web3.eth.accounts[$('#sender').val()],
				value: form.amount.value
			}
		);
}

function getBalance(form) {
	alert(TicTacToeLockedState.getBalance(new Number(form.account.value)));
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
