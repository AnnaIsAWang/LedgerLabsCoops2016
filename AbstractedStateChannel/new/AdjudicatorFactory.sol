import "Adjudicator.sol";

contract AdjudicatorFactory {
	function AdjudicatorFactory(uint _timeout, address _calledContract, bytes4 _methodSignature) returns (Adjudicator) {
		return new Adjudicator(_timeout, _calledContract, _methodSignature, msg.sender);
	}
}
