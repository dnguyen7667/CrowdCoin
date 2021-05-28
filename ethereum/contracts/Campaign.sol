// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;
// contract Test{
//     int public first;
//     int public second;
    
//     constructor(){
//         first = 3;
//         second = 2;
//     }
    
//     function divide () public view returns (int){
//         return first/2;
//     }
// }


// CAMPAIGN FACTORY - Store all deployed campaigns

contract CampaignFactory{
    address [] public deployedCampaigns;
    address public campaignFactoryManager;
    mapping (address=> address[]) public managerCampaignsMapper; // mapper from manager to campaigns;
    mapping (address=> address) public campaignManagerMapper; // mapper from campaign to manager;
    
    
    constructor(){
        campaignFactoryManager = msg.sender;
    }
    
    
    function createCampaign(uint minContrib, string memory campaignTitle, string memory campaignDescription) public {
        address newCampaignAddress = address(new Campaign(minContrib, campaignTitle, campaignDescription, msg.sender)); // create new instance of campaign/ contract
        deployedCampaigns.push(newCampaignAddress);    
        
        // update map of campaign some same manager managing
        managerCampaignsMapper[msg.sender].push(newCampaignAddress); 
        
        // update map of campaign and its manager
        campaignManagerMapper[newCampaignAddress] = msg.sender;
    }
    
    
    function getDeployedCampaigns () public view returns (address [] memory){
        return deployedCampaigns;
    }
    
    
    function getCampaignsByManager (address manager) public view returns (address [] memory){
         return managerCampaignsMapper[manager];
     }
     
     
    function getManagerByCampaign (address campaign) public view returns(address){
         return campaignManagerMapper[campaign];
     }
     
      
}


contract Campaign{
    // ALL VARIABLES
    
    // request for 
    struct Request {
        string description; // description of the request
        uint value; // value of the request
        address payable recipient; // address that will receive the fund from the request
        bool completed; // if the request has been finalized or completed
        uint approvalCount; // count of approvals
        mapping (address=>bool) approvals; // which contributors have approved the request
    }
    
    
    mapping (uint => Request) public requests ; // index to request
    mapping (address => bool) public approvers; // aka contributors -- whoever has donated and is qualified for approving requests
    
    uint public requestsCount; // count of requests
    address public manager; // creator/manager of compaign
    string public campaignTitle;
    string public campaignDescription;
    uint public minimumContribution; //  min amoun to become approvers
    uint public approversCount;    
    // address[] public approvers; // contributors that can vote // bad practice - potentially can cost too much gas
    
    
    // ALL FUNCTIONS
    constructor (uint minContrib, string memory cTitle, string memory cDescription, address creator) {
        requestsCount = 0;
        manager = creator; // set address of manager to be one create the campaign
        minimumContribution = minContrib;       
        campaignTitle = cTitle;
        campaignDescription = cDescription;
    }
    

    
    // payable modifier - make function being able to recieve some amount of money
    function contribute () public payable{
        require(msg.value >= minimumContribution, "Mininum contribution is not met.");
        
        // any contributor is counted as 1 approver regardless of amount contributed
        if (approvers[msg.sender]==false)
        {   
            approversCount++;
            approvers[msg.sender] = true;
            
        }

        
      
        
    }
    
    // modifier - only allow manager to call functions
    modifier onlyManagerAllowed{
        require (msg.sender == manager, "Only manager is allowed to called this function.");
        _;
    }
    

    // create request - only allowed manager
    function createRequest (string memory  description, uint value, address payable recipient) public onlyManagerAllowed{
         // check if request has value less than balance of the contract
         require(value < address(this).balance, "Request value is greater than campaign balance!!");
         
         Request storage newRequest  = requests[requestsCount++];
         
         newRequest.description = description;
         newRequest.value = value;
         newRequest.recipient = recipient;
         newRequest.completed = false;
         newRequest.approvalCount = 0;
        //  requests.push(newRequest); // add to requests array
    }
    
    
    // function to approve request
    function approveRequest(uint index) public {
        
        // check if a person already donated to the project
        require(approvers[msg.sender], "You have not donated to the project.");
        
        Request storage request = requests[index];
        // check if a person has not already voted
        require(!request.approvals[msg.sender], "You already voted!");
        
        // check if request is already existed
        require(index < requestsCount, "You attempt to approve a non-existent request. Check the request index!");
        
        // check if request is completed
        require(!request.completed, "This request was already completed.");
        
        // if all true,
        // then mark the person as already voted
        request.approvals[msg.sender] = true;
        // then increment the approval count of request
        request.approvalCount++;
    }
    
    
    // function to finalize request - only manager allowed
    function finalizeRequest(uint index) public onlyManagerAllowed{
        Request storage request = requests[index];
        
        // check if request is already existed
        require(index < requestsCount, "You attempt to finalize a non-existent request. Check the request index!");

        // check to make sure request hasnt been completed
        
        require(!request.completed, "This request was already completed.");
        
        // check to make sure request has at least 1 approvalCount
        require(request.approvalCount >= 1, "This request has not been approved by anyone.");
        
        // check to make sure at least 50% of all approvers approve the request
        require((request.approvalCount) > (approversCount/2), "Approval rate less  than 50%");
        
        // if all above pass, then
        
        // 1. mark request as completed
        
        request.completed = true;
        
        // 2. then send to recipient
        request.recipient.transfer(request.value);
        
    }
    
    // request details
    function getRequestDetails(uint index) public view returns (string memory, uint, address, bool, uint){
        Request storage request = requests[index];
        
        string memory description = request.description; // description of the request
        uint value = request.value; // value of the request
        address recipient = request.recipient; // address that will receive the fund from the request
        bool completed = request.completed; // if the request has been finalized or completed
        uint approvalCount = request.approvalCount; // count of approvals
        
        return (description,
                value,
                recipient,
                completed,
                approvalCount);
    }
    
    // function to show total balance of a contract/campaign
    function getCampaignBalance() public view returns (uint){
        return (address(this).balance);
    }
    
    
    // return a campaign's details
    function getCampaignSummary() public view returns (uint, string memory, string memory, uint, uint, uint, address){
        return (
            minimumContribution,
            campaignTitle, 
            campaignDescription,
            this.getCampaignBalance(),
            requestsCount,
            approversCount,
            manager
        );
    }
}
