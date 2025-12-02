// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct SupplyEvent {
        string drugCode;
        string fromLocation;
        string toLocation;
        uint256 timestamp;
    }

    mapping(string => SupplyEvent[]) public history;
    
    event SupplyEventAdded(
        string indexed drugCode,
        string fromLocation,
        string toLocation,
        uint256 timestamp
    );

    function addEvent(
        string memory drugCode,
        string memory fromLocation,
        string memory toLocation
    ) public {
        SupplyEvent memory newEvent = SupplyEvent({
            drugCode: drugCode,
            fromLocation: fromLocation,
            toLocation: toLocation,
            timestamp: block.timestamp
        });
        
        history[drugCode].push(newEvent);
        
        emit SupplyEventAdded(drugCode, fromLocation, toLocation, block.timestamp);
    }

    function getHistory(string memory drugCode) 
        public 
        view 
        returns (
            string[] memory fromLocations,
            string[] memory toLocations,
            uint256[] memory timestamps
        ) 
    {
        SupplyEvent[] memory events = history[drugCode];
        uint256 length = events.length;
        
        fromLocations = new string[](length);
        toLocations = new string[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            fromLocations[i] = events[i].fromLocation;
            toLocations[i] = events[i].toLocation;
            timestamps[i] = events[i].timestamp;
        }
        
        return (fromLocations, toLocations, timestamps);
    }

    function getEventCount(string memory drugCode) public view returns (uint256) {
        return history[drugCode].length;
    }
}

