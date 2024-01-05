// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ArtCommissionContract {
    address payable public artist;
    address payable public client;
    address payable public serviceProvider;
    uint256 public totalCost;
    uint256 public escrowBalance;
    uint256 public deadline;
    uint256 public revisionCount;
    uint256 public maxRevisions = 3;
    string public artworkDetails;
    string public revisionDetails;
    string public ipfsHash;
    string[] public ipfsHashHistory;
    bool public isApproved;
    bool public isCancelled;
    bool public isCompleted;
    bool public revisionRequested;

    // Event to log key contract actions
    event CommissionAction(address indexed initiator, string action, uint256 timestamp);

    // Modifier to ensure that only authorized account can call specific functions
    modifier onlyParties() {
        require(msg.sender == artist || msg.sender == client || msg.sender == serviceProvider, "Not authorized");
        _;
    }

    modifier onlyArtist() {
        require(msg.sender == artist, "Not authorized");
        _;
    }

    modifier onlyClient() {
        require(msg.sender == client, "Not authorized");
        _;
    }

    // Contract initialization
    constructor(
        address payable _artist,
        address payable _client,
        address payable _serviceProvider,
        uint256 _totalCost,
        uint256 _deadline,
        string memory _artworkDetails,
        string memory _ipfsHash
    ) {
        artist = _artist;
        client = _client;
        serviceProvider = _serviceProvider;
        totalCost = _totalCost;
        deadline = _deadline;
        artworkDetails = _artworkDetails;
        isApproved = false;
        isCancelled = false;
        isCompleted = false;
        escrowBalance = 0;
        ipfsHash = _ipfsHash;
        ipfsHashHistory.push("");

        emit CommissionAction(msg.sender, "Contract initiated", block.timestamp);
    }

    // Function for the client to make full payment to escrow with fee deduction
    function makeFullPayment() external payable onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        require(msg.value == totalCost * 105 / 100, "Incorrect payment amount");

        // Deduct 5% fee and send it to the service provider
        uint256 serviceFee = (msg.value * 5) / 105;
        serviceProvider.transfer(serviceFee);

        // Deposit the remaining 95% to the escrow
        escrowBalance += msg.value - serviceFee;

        emit CommissionAction(msg.sender, "Full payment received to escrow with fee deduction", block.timestamp);
    }

    // Function for the artist to submit the completed artwork
    function submitArtwork(string memory _ipfsHash) external onlyArtist {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        // Store the IPFS hash
        ipfsHash = _ipfsHash;

        isCompleted = true;

        emit CommissionAction(msg.sender, "Artwork submitted", block.timestamp);
    }

    // Function for the client to approve the artwork
    function approveArtwork() external onlyClient {
        require(isCompleted && !isCancelled, "Artwork is not completed or contract is cancelled");
        // Perform artwork approval logic
        isApproved = true;
        // Release funds to the artist
        artist.transfer(escrowBalance);
        escrowBalance = 0;
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
    function requestRevision(string memory _revisionDetails) external onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        require(!revisionRequested, "Artist is still working on the revised artwork");
        require(revisionCount < maxRevisions, "Maximum number of revisions reached");

        revisionDetails = _revisionDetails;
        revisionRequested = true;
        revisionCount++;

        emit CommissionAction(msg.sender, "Revision requested", block.timestamp);
    }

    // Function for the artist to submit a revised version of the artwork
    function submitRevisedArtwork(string memory _ipfsHash) external onlyArtist {
        require(revisionRequested, "No revision requested");
        require(msg.sender == artist, "Only the artist can submit a revised artwork");

        // Save the current IPFS hash to the history
        ipfsHashHistory.push(ipfsHash);

        ipfsHash = _ipfsHash;
        revisionRequested = false;

        uint256 commissionFee = (escrowBalance * 10) / 100;
        serviceProvider.transfer(commissionFee);

        artist.transfer(escrowBalance - commissionFee);

        emit CommissionAction(msg.sender, "Revised artwork submitted and payment released", block.timestamp);
    }

    // Function to check the contract status
    function checkContractStatus() external view returns (bool, bool, bool) {
        return (isApproved, isCancelled, isCompleted);
    }
}
