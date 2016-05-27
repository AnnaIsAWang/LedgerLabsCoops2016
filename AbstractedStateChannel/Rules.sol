import "Adjudicator.sol";
import "LockedState.sol";

contract Rules {

	event StateChannelCreated(address Adjudicator, address LockedState);

	Adjudicator adjudicator;

	function Rules() {
		adjudicator = createAdjudicator();
		StateChannelCreated(adjudicator, adjudicator.getLockedStateAddress());
	}

	function createAdjudicator() internal returns (Adjudicator);

	// you may define the rules and exposure conditions of the state channel
	// in a subcontract that inherits from this contract
}
