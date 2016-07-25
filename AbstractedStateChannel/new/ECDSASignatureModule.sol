import "SignatureModule";

contract ECDSASignatureModule is SignatureModule {
	address signer;

	function ECDSASignatureModule(address _signer) {
		signer = _signer;
	}

	function verify(bytes32 _hash, bytes32[] _signature) returns (bool) {
		if (_signature.length != 3) {
			return false;
		}
		return _signer == ecrecover(
			_hash,
			uint8(_signature[0]),
			_signature[1],
			_signature[2]
		);
	}
}
