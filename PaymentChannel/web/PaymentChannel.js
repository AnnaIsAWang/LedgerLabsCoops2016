var contractAddress = "0x0c4519c4be63947a3Ca553DC215E55FF23465A91";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var paymentChannel = web3.eth.contract(
		[{"constant":true,"inputs":[{"name":"payToZero","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"getHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"_payToZero","type":"uint256"},{"name":"_nonce","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"endContract","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"finaliseContract","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"address0","type":"address"},{"name":"address1","type":"address"},{"name":"_timeout","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"paymentToAddressZero","type":"uint256"},{"indexed":false,"name":"paymentToAddressOne","type":"uint256"}],"name":"ContractUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"paymentToAddressZero","type":"uint256"},{"indexed":false,"name":"paymentToAddressOne","type":"uint256"}],"name":"ContractPaid","type":"event"}]
		).at(contractAddress);

function sign(form) {
	var signature = web3.eth.sign(web3.eth.accounts[form.index.value], paymentChannel.getHash(web3.toDecimal(form.payment.value), web3.toDecimal(form.nonce.value)));
	form.r.value = '0x' +signature.substr(2, 64);
	form.s.value = '0x' +signature.substr(66, 64);
	form.v.value = web3.toDecimal('0x' +signature.substr(130, 2)) + 27;
}

function endContract(form) {
	alert(paymentChannel.endContract.sendTransaction(form.payment.value, form.nonce.value, form.v.value, form.r.value, form.s.value, {from: web3.eth.accounts[form.index.value]}));
}

function finaliseContract(form) {
	alert(paymentChannel.finaliseContract.sendTransaction({from: web3.eth.accounts[form.index.value]}));
}
