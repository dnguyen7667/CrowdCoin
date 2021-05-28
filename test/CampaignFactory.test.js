const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-cli');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

// campaign abi and bytecode
const campaign_abi = compiledCampaign["abi"];
const campaign_bytecode = compiledCampaign["evm"]["bytecode"]["object"];


// campaign abi and bytecode
const campainFactory_abi = compiledCampaignFactory["abi"];
const campainFactory_bytecode = compiledCampaignFactory["evm"]["bytecode"]["object"];



// set up web3
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts; // accounts that will interact with factory
let manager; // contact manager
const MIN_CONTRIB = 1000; // 1000 wei
let deployedCampaigns_before;
let deployedCampaigns_before_length;
let campaignManager;
let campaignManagerCampaigns = []; // records of all campaign a creator has created
let newCampaign;
let deployedCampaigns;
let campaignAddress;
let campaign;
let contributor;
let contributor2;
let contributor3;
let notAContributor;
let requestDescription;
let requestValue;
let requestRecipient;
let totalRequestsBefore;

// console.log();


beforeEach(async () => {
   accounts = await web3.eth.getAccounts();
   manager = accounts[0];
   campaignManager = accounts[1];

   // deploy the factory
   factory = await new web3.eth.Contract(campainFactory_abi)
                     .deploy({data: campainFactory_bytecode})
                     .send({from: manager, gas: "4000000"} );

    // deployedCampaigns_before = await factory.methods.getDeployedCampaigns().call();
    // deployedCampaigns_before_length = parseInt(deployedCampaigns_before.length);
    // // create a campaign

    await factory.methods.createCampaign(MIN_CONTRIB)
                .send({from: campaignManager, gas: '3000000'});


    deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = deployedCampaigns[0];

    // create a campaign contract
    campaign = await new web3.eth.Contract(campaign_abi, campaignAddress);


    notAContributor = accounts[9];
    contributor = accounts[2];
    contributor2 = accounts[3];
    contributor3 = accounts[4];
    
    await campaign.methods.contribute().send({from: contributor, value: '10000000000000000000'});   //10 ether
    await campaign.methods.contribute().send({from: contributor2, value: '10000000000000000000'});
    await campaign.methods.contribute().send({from: contributor3, value: '10000000000000000000'});


    requestDescription = "test request";
    requestValue = '1000000000000000000'; // 1 ether
    requestRecipient = accounts[5];

    totalRequestsBefore = await campaign.methods.requestsCount().call();
    totalRequestsBefore = parseInt(totalRequestsBefore);

    await campaign.methods.createRequest(requestDescription, requestValue, requestRecipient).send({from: campaignManager, gas: '3000000'});

   
});



describe('Test functions in Campaign Factory', () => {
  
//    it('should deploy factory and campaign successfully', () => {
//      assert.ok(factory.options.address);
//      assert.ok(campaign.options.address);
//      assert.equal(campaignAddress, campaign.options.address);
//    });

//    it('should create a campaign successfully', async() => {
//      // check that the number of deployedCampaigns shoult be 1 more
//     deployedCampaigns_before = await factory.methods.getDeployedCampaigns().call();
//     deployedCampaigns_before_length = parseInt(deployedCampaigns_before.length);

//     await factory.methods.createCampaign(MIN_CONTRIB)
//                 .send({from: campaignManager, gas: '3000000'});
//     //  number of campaigns after a new one is created
//     deployedCampaigns_after = await factory.methods.getDeployedCampaigns().call();
//     deployedCampaigns_after_length = parseInt(deployedCampaigns_after.length);

//     assert.equal(deployedCampaigns_before_length + 1, deployedCampaigns_after_length);

//    });


//    it('should check if deployed campaign is registered with correct creator', async () => {
    
    
//     firstCampaign = await factory.methods.deployedCampaigns(0).call();
//     creator = await factory.methods.campaignManagerMapper(firstCampaign).call();

//     assert.equal(campaignManager, creator);
//    });


//    it('should check if manager has correct number of campaigns he is managing', async () => {
//        // deploy another campaign and check if the same creator correctly has 2 campaigns
//     campaignManagerCampaigns_before = await factory.methods.getCampaignsByManager(campaignManager).call();
//     campaignManagerCampaigns_before_length = parseInt(campaignManagerCampaigns_before.length);

//     // create another campaign
//     newCampaign = await factory.methods.createCampaign(MIN_CONTRIB).send({from: campaignManager, gas: '3000000'});

//     campaignManagerCampaigns_after = await factory.methods.getCampaignsByManager(campaignManager).call();
//     campaignManagerCampaigns_after_length = parseInt(campaignManagerCampaigns_after.length);

//     assert.equal(campaignManagerCampaigns_after_length, campaignManagerCampaigns_before_length + 1);

//     campaigns = campaignManagerCampaigns_after;

//    });


//    // test contribute function
//    it('should have correct info updated approvers count and make approvers into valid approver after valid contribution', async () => {
       
       
//        approversCountBefore = await campaign.methods.approversCount().call();
//        approversCountBefore = parseInt(approversCountBefore);

//        // account 1 to contribute to the projecct
//        contributor = accounts[1];
//        await campaign.methods.contribute().send({from: contributor, value: MIN_CONTRIB});
//        approversCountAfter = await campaign.methods.approversCount().call();
//        approversCountAfter = parseInt(approversCountAfter);

//        assert.equal(approversCountBefore + 1, approversCountAfter );
//        validApprover = await campaign.methods.approvers(contributor).call();
//        assert(validApprover);

//         // this account hasnt contributed, thus should not be a valid approver
//        randomAddress = accounts[2];
//        invalidApprover = await campaign.methods.approvers(randomAddress).call();
//        assert(!invalidApprover);
//    });

    it('should have correct campaign manager', async () => {
        const cManager = await campaign.methods.manager().call();
        assert.equal(cManager, campaignManager);
    });

   it('should create a valid request', async () => {
 
        // 

        totalRequestsAfter = await campaign.methods.requestsCount().call();
        totalRequestsAfter = parseInt(totalRequestsAfter);

        assert.equal(totalRequestsBefore + 1, totalRequestsAfter);

        // check if request registered correctly
        request = await campaign.methods.requests(0).call();
        assert.equal(request.description, requestDescription);
        assert.equal(request.value, requestValue);
        // console.log();
        assert.equal(request.recipient, requestRecipient);
        assert(!request.completed);
        assert.equal(request.approvalCount, 0);

   });

   it('should have valid contributor to approve request', async () => {
        requestIndex = 0;
        requestStateBefore = await campaign.methods.requests(requestIndex).call();
        // assert(!requestStateBefore.approvers[contributor]);

        try{
           await campaign.methods.approveRequest(requestIndex).send({from: contributor, gas: '3000000'});
            assert(true);
        } catch(err){
            assert(err);
        }

        // if you already vote you cannot vote again
        try{
           await campaign.methods.approveRequest(requestIndex).send({from: contributor, gas: '3000000'});
           assert(false);
        } catch(err){
            assert(err);
        }
        

       // random address must fail to approve request
       try{
           await campaign.methods.approveRequest(requestIndex).send({from: notAContributor, gas: '3000000'});
           assert(false);
       } catch(err){
           assert(err);
        }

        // check if approversCount is 1
        requestStateAfter = await campaign.methods.requests(requestIndex).call();
        assert.equal(parseInt(requestStateBefore.approvalCount) + 1, parseInt(requestStateAfter.approvalCount));
        console.log(requestStateAfter.approvals);
        // assert(requestStateAfter.approvals[contributor]);
        // await campaign.methods.requests(requestIndex).approvals.call();
   });

   it('should allow manager to make payment request', async () => {
       requestIndex = 0;
       // fail to finalize the request because noone has approved
        try{
            await campaign.methods.finalizeRequest(requestIndex).send({from: notAContributor, gas: '3000000'});
            assert(false);
        } catch (error){
            assert(error);
        }

        try{
            await campaign.methods.finalizeRequest(requestIndex).send({from: campaignManager, gas: '3000000'});
            assert(false);
        } catch (error){
            assert(error);
        }

        // have a contributor to approve the request
        await campaign.methods.approveRequest(requestIndex).send({from: contributor, gas: '3000000'});
        // assert still need to fail because less than 50% approvers approve (2/3 approvers havent approved)
        try{
            await campaign.methods.finalizeRequest(requestIndex).send({from: campaignManager, gas: '3000000'});
            assert(false);
        } catch (error){
            assert(error);
        }


        contractBalanceBefore = await campaign.methods.getCampaignBalance().call();


        // have another approver approve
        await campaign.methods.approveRequest(requestIndex).send({from: contributor2, gas: '3000000'});

        recipientValueBefore = await web3.eth.getBalance(requestRecipient);
        recipientValueBefore = await web3.utils.fromWei(recipientValueBefore, 'ether');

        // then approve the request
        await campaign.methods.finalizeRequest(requestIndex).send({from: campaignManager, gas: '3000000'});

        // AFTER majority of approvers approve, check if the money is sent to recipient, status is complete
        requestState = await campaign.methods.requests(requestIndex).call();

        
        assert(requestState.completed);
        // console.log(requestState.value);
        // assert.equal(parseInt(requestState.value), 0);

        approversCount = await campaign.methods.approversCount().call();
        approversCount = parseInt(approversCount);

        // console.log(parseFloat(requestState.approvalCount)/approversCount);

        assert(parseFloat(requestState.approvalCount)/approversCount > 0.5);

        recipientValueAfter = await web3.eth.getBalance(requestRecipient);
        recipientValueAfter = await web3.utils.fromWei(recipientValueAfter, 'ether');
        // console.log(recipientValueAfter, recipientValueBefore);

        contractBalanceAfter = await campaign.methods.getCampaignBalance().call();
        // console.log(contractBalanceBefore, contractBalanceAfter);
        assert(recipientValueAfter > recipientValueBefore);
   });




  
});