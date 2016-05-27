// Major problem right now is that closing or refreshing the page with your current games on it will 
// make the X's and O's disappear on the web page even though they will still be recorded on the
// blockchain. However closing or refreshing the page is necessary for new games to appear and for
// finished ones to disappear making it impractical to try and start a game while playing another one

var contractAddress = ""; // So this obviously needs to be filled in

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var ttt = web3.eth.contract(ABI).at(contractAddress); // ABI needs to be a real ABI

function newGame(form) {
	var gameID = ttt.newGame.sendTransaction({from: web3.eth.accounts[0], value: form.bet.value * 10 ** 18});
}

function joinGame(gameID) {
	ttt.accept.sendTransaction(gameID, {from: web3.eth.accounts[0], value: ttt.games[gameID].bet);
	if (ttt.games[gameID].active) {
		alert("You have joined the game, now check active games to play!");
	}
}

function list() {
	window.open();
	document.write('<center>');
	document.write('<h1> Current Challenges </h1>');
	var info = ttt.getCurrentGames();
	var length = info.length;
	for (var k = 0; k < length - 1; k += 2) {
		document.write('<p> Game '+info[k]+': Call the '+info[k+1]/(10**18)+' ethers </p>');
		document.write('<input type="button" value="Accept" onClick="joinGame('+info[k]+')>');
}

function blocks() {
	window.open();
	document.write('<center>');
	document.write('<h1> Active Games </h1>');
	var mine = ttt.getMyGames();
	var length = mine.length;
	for (var m = 0; m < length - 1; m += 2) {
		document.write('<p> Game '+mine[m]+' with '+mine[m+1]/(10**18)+' ethers at stake </p>');
		for (var i = 0; i < ttt.gridSize; ++i) {
			for (var j = 0; j < ttt.gridSize; ++j) {
				document.write('<input type="button" id='+(i + ttt.gridSize * j)+' onClick="move(this.id, this.value, '+mine[m]+')" value=" "'+'<br>');
			}
			document.write('<br>');
		}
	document.write('<br>');
	}
}

function move(index, value, gameID) {
	if (ttt.winner.sendTransaction(index, gameID, {from: web3.eth.accounts[0]})) {
		value = getLetter(gameID);
		if (value == 1) {
			value = "X";
		else if (value == 2) {
			value = "O";
		}
	}
}
