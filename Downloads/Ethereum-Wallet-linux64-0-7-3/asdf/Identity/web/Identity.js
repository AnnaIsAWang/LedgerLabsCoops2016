var contractAddress = "0x3f3b7d763bc520ba3Fc861922Fa9f65aD51130Ef";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var identityManager = web3.eth.contract(
	[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"username","type":"string"}],"name":"getCurrentOwner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"string"},{"name":"addr","type":"address"}],"name":"changeOwner","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"string"}],"name":"register","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"username","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"UserRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"username","type":"string"},{"indexed":false,"name":"oldOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}]
).at(contractAddress);

function register(form) {
	alert(identityManager.register.sendTransaction(form.username.value, {from: web3.eth.accounts[0]}));
}

function changeOwner(form) {
	alert(identityManager.changeOwner.sendTransaction(form.username.value, form.address.value, {from: web3.eth.accounts[0]}));
}

function getCurrentOwner(form) {
	alert(identityManager.getCurrentOwner(form.username.value));
}
