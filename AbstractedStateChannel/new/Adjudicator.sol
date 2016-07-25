import "StateChannel.sol";
import "Rules.sol";

contract Adjudicator {
	StateChannel creator;
	address calledContracts;
	bytes4[] methodSignatures;
	bytes32[][] arguments;
	uint nonce = 0;
	uint lastTimestamp = 0;
	uint timeout;
	mapping (SignatureModule => uint) consents;

	function Adjudicator(uint _timeout, address _calledContract, bytes4 _methodSignature, StateChannel _creator) {
		timeout = _timeout;
		calledContract = _calledContract;
		methodSignature = _methodSignature;
		creator = _creator;
	}

	function verifySignatures(bytes32 _hash, bytes32[][] _signatures) returns (bool) {
		SignatureModule[] signatureModules = creator.signatureModules();
		for (uint i = 0; i < signatureModules.length; i++) {
			if (!signatureModules[i].verify(_hash, _signatures[i]) {
				return false;
			}
		}
		return true;
	}

	function close(
		address _calledContracts,
		bytes4[] _methodSignatures,
		bytes32[][] _arguments,
		uint _nonce,
		bytes32[][] _signatures
	) external returns (bool) {
		if (verifySignatures(sha3(_calledContracts, _methodSignatures, _arguments, _nonce, creator), _signatures) {
			calledContracts = _calledContracts;
			methodSignatures = _methodSignatures;
			arguments = _arguments;
			nonce = _nonce;
			lastTimestamp = now;
			return true;
		} else {
			return false;
		}
	}

	function giveConsent(uint _moduleIndex, bytes32 _signatures) external returns (bool) {
		SignatureModule[] signatureModules = creator.signatureModules();
		if (signatureModules[_moduleIndex].verify(sha3(nonce, creator), _signatures)) {
			consents[signatureModules[_moduleIndex]] = nonce;
			return true;
		} else {
			return false;
		}
	}

	function finalise() external returns (bool) {
		if (lastTimestamp > 0 && lastTimestamp + timeout < now) {
			if (!creator.eval(calledContracts, methodSignatures, arguments)) {
				throw;
			} else {
				return true;
			}
		}

		SignatureModule[] signatureModules = creator.signatureModules();

		for (uint i = 0; i < signatureModules.length; i++) {
			if (consents[signatureModules[i]] != nonce) {
				return false;
			}
		}

		if (!creator.eval(calledContracts, methodSignatures, arguments)) {
			throw;
		} else {
			return true;
		}
	}
}
