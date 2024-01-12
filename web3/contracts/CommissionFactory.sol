// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ArtCommissionContract.sol";

contract CommissionFactory {
    event CommissionContractCreated(address indexed commissionContractAddress, address indexed initiator, uint256 timestamp);

    function createCommissionContract(
        address payable _client,
        address payable _artist,
        uint256 _totalCost,
        uint256 _maxRevisions
    ) external returns (address) {
        ArtCommissionContract newCommissionContract = new ArtCommissionContract();
        
        // Set client, artist, total cost, and max revisions for the new commission contract
        newCommissionContract.setClientAddress(_client);
        newCommissionContract.setArtistAddress(_artist);
        newCommissionContract.setTotalCost(_totalCost);
        newCommissionContract.setMaxRevisions(_maxRevisions);

        // Emit an event indicating the creation of a new commission contract
        emit CommissionContractCreated(address(newCommissionContract), msg.sender, block.timestamp);

        return address(newCommissionContract);
    }
}
