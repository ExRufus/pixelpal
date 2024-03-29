// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ArtCommissionContract {
    address payable public artist;
    address payable public client;
    address payable public serviceProvider;
    uint256 public totalCost;
    uint256 public escrowBalance;
    uint256 public revisionCount;
    uint256 public maxRevisions;
    string public ipfsHash;
    string[] public ipfsHashHistory;
    bool public isCancelled;
    bool public isCompleted;
    bool public artFinished;
    bool public revisionRequested;

    event CommissionAction(address indexed initiator, string action, uint256 timestamp);

    modifier onlyParties() {
        require(msg.sender == artist || msg.sender == client || msg.sender == serviceProvider, "Not authorized");
        _;
    }

    modifier onlyArtist() {
        require(msg.sender == artist, "Only artist is authorized");
        _;
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client is authorized");
        _;
    }

    // Contract initialization
    constructor() {
        artist = payable(address(0)); // No specific artist initially
        client = payable(address(0)); // No specific client initially
        serviceProvider = payable(address(0)); // The service provider is the one deploying the contract
        isCancelled = false;
        isCompleted = false;
        artFinished = false;
        escrowBalance = 0;
        totalCost = 0;
        maxRevisions = 0;

        emit CommissionAction(msg.sender, "Contract initiated", block.timestamp);
    }

    function setClientAddress(address payable _client) external {
        require(client == address(0), "Client address already set");
        client = _client;
    }

    function setArtistAddress(address payable _artist) external {
        require(artist == address(0), "Artist address already set");
        artist = _artist;
    }

    function setServiceProviderAddress(address payable _serviceProvider) external {
        require(serviceProvider == address(0), "Service provider address already set");
        serviceProvider = _serviceProvider;
    }

    function setTotalCost(uint256 _totalCost) external onlyParties {
        require(totalCost == 0, "Total cost already set");
        totalCost = _totalCost;
    }

    function setMaxRevisions(uint256 _maxRevisions) external onlyParties {
        require(maxRevisions == 0, "Max revisions already set");
        maxRevisions = _maxRevisions;
    }

    // Function for the client to make full payment to escrow with fee deduction
    function makeFullPayment() external payable onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        require(msg.value >= totalCost * 105 / 100, "Incorrect payment amount");

        // Deduct 5% fee and send it to the service provider
        uint256 serviceFee = (msg.value * 5) / 105;
        serviceProvider.transfer(serviceFee);

        // Deposit the remaining 95% to the escrow
        escrowBalance += msg.value - serviceFee;

        emit CommissionAction(msg.sender, "Full payment received to escrow with fee deduction", block.timestamp);
    }

    // Function for the artist to submit the completed artwork
    function submitArtwork(string memory _ipfsHash) external onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        // Store the IPFS hash
        ipfsHashHistory.push(ipfsHash);
        ipfsHash = _ipfsHash;

        artFinished = true;

        emit CommissionAction(msg.sender, "Artwork submitted", block.timestamp);
    }

    // Function for the client to approve the artwork
    function approveArtwork() external onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        require(artFinished, "Artist is still working on the revised artwork");

        // Release funds to the artist
        artist.transfer(escrowBalance);
        escrowBalance = 0;

        isCompleted = true;

        emit CommissionAction(msg.sender, "Artwork approved, payment released", block.timestamp);
    }

    // Function to handle cancellation and refund with fee deduction
    function cancelContract() external onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        
        // Refund 50% of the payment to the client
        uint256 refundAmount = (escrowBalance * 50) / 100;
        client.transfer(refundAmount);
        
        // Pay 50% of the payment to the artist
        artist.transfer(escrowBalance - refundAmount);
        escrowBalance = 0;

        isCancelled = true;

        emit CommissionAction(msg.sender, "Contract cancelled, partial refund provided", block.timestamp);
    }

    // Function for the client to request a revision
    function requestRevision() external onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        require(!revisionRequested, "Artist is still working on the revised artwork");
        require(revisionCount < maxRevisions, "Maximum number of revisions reached");

        artFinished = false;
        revisionRequested = true;
        revisionCount++;

        emit CommissionAction(msg.sender, "Revision requested", block.timestamp);
    }

    // Function for the artist to submit a revised version of the artwork
    function submitRevisedArtwork(string memory _ipfsHash) external onlyParties {
        require(revisionRequested, "No revision requested");

        // Save the current IPFS hash to the history
        ipfsHashHistory.push(ipfsHash);
        ipfsHash = _ipfsHash;

        artFinished = true;
        revisionRequested = false;

        emit CommissionAction(msg.sender, "Revised artwork submitted", block.timestamp);
    }

    // Function to check the contract status
    function checkContractStatus() external view returns (bool, bool) {
        return (isCancelled, isCompleted);
    }
}