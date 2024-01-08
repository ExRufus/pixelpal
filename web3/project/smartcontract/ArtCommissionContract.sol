// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    IERC20 public token; // ERC-20 token contract

    // Event to log key contract actions
    event CommissionAction(address indexed initiator, string action, uint256 timestamp);

    // Modifier to ensure that only authorized account can call specific functions
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
    constructor(
        address payable _artist,
        address payable _client,
        address payable _serviceProvider,
        uint256 _totalCost,
        uint256 _maxRevisions,
        address _tokenAddress // ERC-20 token address
    ) {
        artist = _artist;
        client = _client;
        serviceProvider = _serviceProvider;
        totalCost = _totalCost;
        maxRevisions = _maxRevisions;
        isCancelled = false;
        isCompleted = false;
        artFinished = false;
        escrowBalance = 0;
        token = IERC20(_tokenAddress); // Initialize ERC-20 token contract

        emit CommissionAction(msg.sender, "Contract initiated", block.timestamp);
    }

    // Function for the client to make full payment to escrow with fee deduction
    function makeFullPayment() external payable onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        // Use ERC-20 transferFrom function to receive payment
        require(token.transferFrom(client, address(this), totalCost * 105 / 100), "Transfer failed");

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
        ipfsHashHistory.push(ipfsHash);
        ipfsHash = _ipfsHash;

        artFinished = true;

        emit CommissionAction(msg.sender, "Artwork submitted", block.timestamp);
    }

    // Function for the client to approve the artwork
    function approveArtwork() external onlyClient {
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
    function requestRevision() external onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        require(!revisionRequested, "Artist is still working on the revised artwork");
        require(revisionCount < maxRevisions, "Maximum number of revisions reached");

        artFinished = false;
        revisionRequested = true;
        revisionCount++;

        emit CommissionAction(msg.sender, "Revision requested", block.timestamp);
    }

    // Function for the artist to submit a revised version of the artwork
    function submitRevisedArtwork(string memory _ipfsHash) external onlyArtist {
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