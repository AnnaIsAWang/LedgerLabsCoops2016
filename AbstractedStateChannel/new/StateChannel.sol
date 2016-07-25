import "SignatureModule.sol";

contract StateChannel {
	SignatureModule[] public signatureModules;

	function StateChannel(SignatureModule[] _signatureModules) {
		signatureModules = _signatureModules;
	}

	function sendEther(address _recipient, uint _amount) external {
		if (!(msg.sender == this && _recipient.send(_amount))) {
			throw;
		}
	}

	function eval(address[] _calledContracts, bytes4[] _methodSignatures, bytes32[][] _arguments) {
		if (
			calledContracts.length != methodSignatures.length ||
			calledContracts.length != arguments.length
		) {
			throw;
		}

		for (uint i = 0; i < evalCalls.length; i++) {
			if (_calledContracts[i].call(_methodSignatures[i], _arguments[i])) {
				throw;
			}
		}
	}
}
