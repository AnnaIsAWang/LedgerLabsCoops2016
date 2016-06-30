if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function tests() {
	// createContractSimulation();
	attach();
	sendStateSimulation(1, "0x02");
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

function sendStateSimulation(nonce, state) {
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
		$('input[name=winner]:nth-child(3)').click();
	} else {
		$('input[name=winner]:nth-child(1)').click();
	}
	
	$('#stateNonce').val(nonce);
	
	$('#sender').val(0);
	$('#SignTheState').click();
	$('#sender').val(1);
	$('#SignTheState').click();

	$('input[name=state]').val(backup);
	$('#sendStateNonce').val(nonce);
	
	var value = parseInt(document.getElementById("stateTable").rows[1].cells[3].innerHTML);
	$('input[name=vX]:first').val(value);
	value = document.getElementById("stateTable").rows[1].cells[4].innerHTML;
	$('input[name=rX]:first').val(value);
	value = document.getElementById("stateTable").rows[1].cells[5].innerHTML;
	$('input[name=sX]:first').val(value);
	
	value = parseInt(document.getElementById("stateTable").rows[2].cells[3].innerHTML);
	$('input[name=vO]:first').val(value);
	value = (document.getElementById("stateTable").rows[2].cells[4].innerHTML);
	$('input[name=rO]:first').val(value);
	value = (document.getElementById("stateTable").rows[2].cells[5].innerHTML);
	$('input[name=sO]:first').val(value);
	
	$('#SendTheState').click();
}

function sendBoardSimulation() {
	// Remember to sign board
}

function badBoardSentSimulation() {
	// Remember to sign boards
}

function checkInSimulation() {
}

function killSimulation() {
	// Remember to sign kill
}

function giveConsentSimulation() {
}

function finaliseChannelSimulation() {
}

function depositFundsSimulation() {
}
