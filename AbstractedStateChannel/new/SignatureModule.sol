contract SignatureModule {
	function verify(bytes32 _hash, bytes32[] _signature) returns (bool);
}
