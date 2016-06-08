// Gives the parameter needed for ecrecover

function signature(data, nonce, rulesAddress) {
	var hash = web3.sha3(data, nonce, rulesAddress);
	var sig = web3.eth.sign(web3.eth.accounts[0], hash);
	var r = "0x" + sig.slice(2, 66);
	var s = "0x" + sig.slice(66, 130);
	var v = 27 + Number(sig.slice(130, 132));
	var ecrecoverData = [hash, v, r, s];
	return ecrecoverData;
}
