function sign(signingAddress, hash) {
	var sig = web3.eth.sign(signingAddress, hash);
	return [
		sig.slice(0, 66),
		'0x' + sig.slice(66, 130),
		27 + Number(sig.slice(130, 132))
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
