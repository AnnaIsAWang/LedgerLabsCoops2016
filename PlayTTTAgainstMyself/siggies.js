var contractAddress = "0x485eD2fa57BB8FEC5AAe6EE77FcE431D7d9eB322";

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var siggies = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "hash", "type": "bytes32" }, { "name": "v", "type": "uint8" }, { "name": "r", "type": "bytes32" }, { "name": "s", "type": "bytes32" } ], "name": "isX", "outputs": [ { "name": "", "type": "bool" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "hash", "type": "bytes32" }, { "name": "v", "type": "uint8" }, { "name": "r", "type": "bytes32" }, { "name": "s", "type": "bytes32" } ], "name": "isO", "outputs": [ { "name": "", "type": "bool" } ], "type": "function" } ]).at(contractAddress);

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
	
	// Check state and change the board accordingly
	if (siggies.isX.call(data[0], data[1], data[2], data[3])) {
		button.value = "X";
	} else if (siggies.isO.call(data[0], data[1], data[2], data[3])) {
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
