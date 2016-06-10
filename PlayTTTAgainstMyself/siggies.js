var contractAddress = "0x218eC5339dF9e3930670765aBCdBF67A26cB4fb9";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var siggies = web3.eth.contract([{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"isX","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"readO","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"isO","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"O","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"readX","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"X","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_addressX","type":"address"},{"name":"_addressO","type":"address"}],"type":"constructor"}]).at(contractAddress);

// Corresponds to the person who you're playing as
var activeAddress = "";

// Generates parameters for ecrecover
function siggy(data, nonce, rulesAddress) {
	var hash = web3.sha3(data, nonce, rulesAddress);
	var sig = web3.eth.sign(activeAddress, hash);
	var r = "0x" + sig.slice(2, 66);
	var s = "0x" + sig.slice(66, 130);
	var v = 27 + Number(sig.slice(130, 132));
	var ecrecoverData = [hash, v, r, s];
	return ecrecoverData;
}

///////////////////////////////////////////////////////////// Called when someone tries to make a move
function moved(button) {
	// Gets parameters for ecrecover
	var data = siggy(0, 0, 0);
	
	// Changes the state
	siggies.isX.sendTransaction(data[0], data[1], data[2], data[3], {from: activeAddress});
	siggies.isO.sendTransaction(data[0], data[1], data[2], data[3], {from: activeAddress});
	
	// Delays the interface so that the state change can be mined, while loop essentially freezes screen
	var currentBlock = web3.eth.blockNumber;
	var nextBlock = web3.eth.blockNumber + 1;
	while(currentBlock < nextBlock) {
		currentBlock = web3.eth.blockNumber;
	}
	
	// Check state and change the board accordingly
	if (siggies.readX()) {
		button.value = "X";
	} else if (siggies.readO()) {
		button.value = "O";
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Creates a select element so you can choose to play as any of your accounts
function addSelect(divname) {
	 // Select element
   var newDiv = document.createElement('div');
   newDiv.setAttribute("id", "div");
   var html = '<select id="accounts">', accounts = web3.eth.accounts, i;
   for(i = 0; i < accounts.length; i++) {
       html += "<option value='"+accounts[i]+"'>"+accounts[i]+"</option>";
   }
   html += '</select>';
   newDiv.innerHTML= html;
   document.getElementById(divname).appendChild(newDiv);
   
   // Submit your selection
   var choose = document.createElement('input');
   choose.setAttribute("type", "button");
   choose.setAttribute("id", "select");
   choose.className = "button";
   choose.onclick = function() {playAgain(divname)};
   choose.setAttribute("value", "Select");
   document.getElementById(divname).appendChild(choose);
   
   // Get rid of the previous button
   document.getElementById(divname).parentNode.removeChild(document.getElementById('add'));
}
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////// A replay button
function playAgain(divname) {
	// Set activeAddress as the choice from the dropdown menu
	activeAddress = accounts.options[accounts.selectedIndex].value;
	
	// Button to replay the game
	var replay = document.createElement('input');
	replay.setAttribute("type", "button");
	replay.setAttribute("id", "replay");
	replay.className = "button";
	replay.onclick = function() {clear(divname)};
	replay.setAttribute("value", "Change Players");
	document.getElementById(divname).appendChild(replay);
	
	// Get rid of the previous buttons
	document.getElementById('div').parentNode.removeChild(document.getElementById('div'));
	document.getElementById('select').parentNode.removeChild(document.getElementById('select'));
}

// Resets the buttons
function clear(divname) {
	document.getElementById('replay').parentNode.removeChild(document.getElementById('replay'));
	addSelect(divname);
}
//////////////////////////////////////////////////////////////////////////////////////////////////
