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

function signState(signingAddress, state, nonce, rulesAddress) {
	return sign(signingAddress, web3.sha3(state, nonce, rulesAddress));
}

function signConsent(signingAddress, nonce, rulesAddress) {
	return sign(signingAddress, web3.sha3(nonce, rulesAddress));
}

function signBoard(signingAddress, board, nonce, rulesAddress) {
	return sign(signingAddress, web3.sha3(board, nonce, rulesAddress));
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
			console.log(e, contract);
			if (typeof contract.address !== 'undefined') {
				console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
				TicTacToeAdjudicator = web3.eth.contract(TIC_TAC_TOE_ADJUDICATOR_INTERFACE).at(contract.getAdjudicatorAddress());
				TicTacToeLockedState = web3.eth.contract(TIC_TAC_TOE_LOCKED_STATE_INTERFACE).at(TicTacToeAdjudicator.getLockedStateAddress());
			}
		}
	);
}

function attachToContract(form) {
	TicTacToeRules = web3.eth.contract(TIC_TAC_TOE_RULES_INTERFACE).at(form.address.value);
	TicTacToeAdjudicator = web3.eth.contract(TIC_TAC_TOE_ADJUDICATOR_INTERFACE).at(TicTacToeRules.getAdjudicatorAddress());
	TicTacToeLockedState = web3.eth.contract(TIC_TAC_TOE_LOCKED_STATE_INTERFACE).at(TicTacToeAdjudicator.getLockedStateAddress());
	alert("Attached to contract!");
}

function signFinalState(form) {
	var state = form.winner.value
		| form.adjudicationDepositX.value
		| form.adjudicationDepositO.value
		| form.disconnectDepositX.value
		| form.disconnectDepositO.value
		| form.cheating.value;	//how the hell to convert this to bytes????

	var signature = signState(
			web3.eth.accounts[$('#sender').val()],
			state,
			new Number(form.nonce.value),
			TicTacToeRules.address
		);

	$('#stateTable').append('<tr><td>'
			+ web3.eth.accounts[$('#sender').val()]
			+ '</td><td>'
			+ state //yo, this is ronggg, this ain't bytes
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

function getNonce(form) {
	alert(TicTacToeAdjudicator.getNonce());
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
});
