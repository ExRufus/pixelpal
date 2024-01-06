// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ArtCommissionContract {
    address payable public artist;
    address payable public client;
    address payable public serviceProvider;
    uint256 public totalCost;
    uint256 public escrowBalance;
    uint256 public maxRevisions;
    uint256 public milestoneCount;
    string public ipfsHash;
    IpfsHashHistory[] public ipfsHashHistory;
    string[] ipfsHashes;
    bool public isCancelled;
    bool public isCompleted;
    Milestone[] public milestones;

    struct IpfsHashHistory {
        string lastIpfsHash;
        string[] ipfsHashes;
    }

    struct Milestone {
        string name;
        uint8 fundPercentage;
        uint256 revisionCount;
        bool isCompleted;
    }

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
        uint256 _maxRevisions,
        string memory _ipfsHash,
        Milestone[] memory _milestones
    ) {
        artist = _artist;
        client = _client;
        serviceProvider = _serviceProvider;
        totalCost = _totalCost;
        maxRevisions = _maxRevisions;
        milestoneCount = 0;
        isCancelled = false;
        isCompleted = false;
        escrowBalance = 0;
        ipfsHash = _ipfsHash;

        for (uint256 i = 0; i < _milestones.length; i++) {
            milestones.push(Milestone(_milestones[i].name, _milestones[i].fundPercentage, 0, false));
        }

        emit CommissionAction(msg.sender, "Contract initiated", block.timestamp);
    }

    // Function for the client to make full payment to escrow with fee deduction
    function makeFullPayment() external payable onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        require(msg.value == totalCost * 105 / 100, "Incorrect payment amount");

        // Deduct 5% fee and send it to the service provider
        uint256 serviceFee = (msg.value * 5) / 105;
        serviceProvider.transfer(serviceFee);

        // Deposit the remaining to the escrow
        escrowBalance += msg.value - serviceFee;

        emit CommissionAction(msg.sender, "Full payment received to escrow with fee deduction", block.timestamp);
    }

    // Function for the artist to submit the completed artwork
    function submitArtwork(string memory _ipfsHash) external onlyArtist {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        // Store the last IPFS hash
        ipfsHash = _ipfsHash;

        // Find the current milestone
        Milestone storage currentMilestone = milestones[milestoneCount];

        // Check if the milestone is not already completed
        require(!currentMilestone.isCompleted, "Milestone already completed");

        // Store the IPFS hash
        delete ipfsHashes;
        ipfsHashes.push(_ipfsHash);
        ipfsHashHistory.push(IpfsHashHistory(_ipfsHash, ipfsHashes));

        emit CommissionAction(msg.sender, "Artwork submitted", block.timestamp);
    }

    // Function for the client to approve artwork on each milestone
    function approveMilestone() external payable onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");

        // Find the current milestone
        Milestone storage currentMilestone = milestones[milestoneCount];

        // Check if the milestone is not already completed
        require(!currentMilestone.isCompleted, "Milestone already completed");

        // Mark the milestone as completed
        currentMilestone.isCompleted = true;

        // Release fund and mark as completed if this is the last milestone
        if(milestoneCount == milestones.length - 1) {
            artist.transfer(escrowBalance);
            escrowBalance = 0;
            isCompleted = true;
        }

        milestoneCount++;

        emit CommissionAction(msg.sender, "Milestone approved, refund provided", block.timestamp);
    }

    // Function to handle cancellation and refund with fee deduction
    function cancelContract() external onlyParties {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        
        // Find the current milestone
        Milestone storage currentMilestone = milestones[milestoneCount];

        // Refund the payment to the client
        uint256 refundAmount = escrowBalance * currentMilestone.fundPercentage / 100;
        client.transfer(refundAmount);
        
        // Pay the payment to the artist
        artist.transfer(escrowBalance - refundAmount);

        escrowBalance = 0;
        isCancelled = true;
        emit CommissionAction(msg.sender, "Contract cancelled, partial refund provided", block.timestamp);
    }

    // Function for the client to request a revision
    function requestRevision() external onlyClient {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        
        // Find the current milestone
        Milestone storage currentMilestone = milestones[milestoneCount];

        require(currentMilestone.revisionCount < maxRevisions, "Maximum number of revisions reached");

        milestones[milestoneCount].revisionCount++;

        emit CommissionAction(msg.sender, "Revision requested", block.timestamp);
    }

    // (NOT DONE YET) Function for the artist to submit a revised version of the artwork
    function submitRevisedArtwork(string memory _ipfsHash) external onlyArtist {
        require(!isCompleted && !isCancelled, "Contract is already completed or cancelled");
        
        // Store the last IPFS hash
        ipfsHash = _ipfsHash;

        // Find the current milestone
        Milestone storage currentMilestone = milestones[milestoneCount];

        // Check if the milestone is not already completed
        require(!currentMilestone.isCompleted, "Milestone already completed");

        // Store the IPFS hash
        ipfsHashes.push(_ipfsHash);
        ipfsHashHistory[milestoneCount].lastIpfsHash = _ipfsHash;
        ipfsHashHistory[milestoneCount].ipfsHashes = ipfsHashes;

        emit CommissionAction(msg.sender, "Revised artwork submitted", block.timestamp);
    }

    // Function to check the contract status
    function checkContractStatus() external view returns (bool, bool) {
        return (isCancelled, isCompleted);
    }
}
