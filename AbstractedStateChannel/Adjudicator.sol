import "Owned.sol";
import "LockedState.sol";

contract Adjudicator is Owned {

    event CloseEvent(bytes state, uint nonce);
    event ChannelFinalised(bytes state);
    event ConsentGiven(address consenter, uint nonce);

    LockedState lockedState;
    address[] addresses;
    uint consenters;
    uint timeout;
    uint nonce = 0;
    uint lastTimestamp = 0;
    bytes state;
    mapping (address => uint) consentGiven;

    function Adjudicator(address[] _addresses, uint _consenters, uint _timeout) {
        addresses = _addresses;
        consenters = _consenters;
        timeout = _timeout;
        lockedState = createLockedState();
    }

    function createLockedState() internal returns (LockedState);

    function getState() constant external returns (bytes state) {}
    function getLockedStateAddress() constant external returns (address lockedState) {}

    function close(
        uint requiredSignators,
        bytes data,
        uint newNonce,
        uint8[] v,
        bytes32[] r,
        bytes32[] s
    ) external onlyOwner returns (bool) {
        if (newNonce >= nonce) {
            return false;
        }

        bytes32 hash = sha3(data, newNonce);

        uint signatures = 0;
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == ecrecover(hash, v[i], r[i], s[i])) {
                signatures++;
            }

            if (signatures >= requiredSignators) {
                nonce = newNonce;
                lastTimestamp = now;
                state = data;
                CloseEvent(state, nonce);
                return true;
            }
        }

        return false;
    }

    function giveConsent(uint8 v, bytes32 r, bytes32 s) {
        address consenter = ecrecover(sha3(nonce), v, r, s);
        consentGiven[consenter] = nonce;
        ConsentGiven(consenter, nonce);
    }

    function doBroadcast() internal returns (bool) {
        if (lockedState.broadcastState(state)) {
            ChannelFinalised(state);
            return true;
        } else {
            return false;
        }
    }

    function finaliseChannel() external returns (bool) {
        if (lastTimestamp > 0 && lastTimestamp + timeout < now) {
            return doBroadcast();
        }

        uint consentCount = 0;
        for (uint i = 0; i < addresses.length; i++) {
            if (consentGiven[addresses[i]] == nonce) {
                consentCount++;
            }

            if (consentCount >= consenters) {
                return doBroadcast();
            }
        }

        return false;
    }

    function kill() external onlyOwner {
        lockedState.kill();
        selfdestruct(owner);
    }
}
