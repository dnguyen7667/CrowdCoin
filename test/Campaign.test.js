// const assert = require('assert');
// const Web3 = require('web3');
// const ganache = require('ganache-cli');
// const compiledCampaign = require('../ethereum/build/Campaign.json');

// // campaign abi and bytecode
// const campaign_abi = compiledCampaign["abi"];
// const campaign_bytecode = compiledCampaign["evm"]["bytecode"]["object"];


// // set up web3
// const provider = ganache.provider();
// const web3 = new Web3(provider);

// let accounts; // accounts that will interact with contract
// let manager; // contact manager
// const MIN_CONTRIB = 1000; // 1000 wei

// // console.log();


// beforeEach(async () => {
//    accounts = await web3.eth.getAccounts();
//    manager = accounts[0];

//    // deploy the contract
//    campaign = await new web3.eth.Contract(campaign_abi)
//                      .deploy({data: campaign_bytecode, arguments: [MIN_CONTRIB, manager] })
//                      .send({from: manager, gas: "4000000"} );

// });

// describe('Test functions in Campaign contract', () => {
//    it('should deploy campaign successfully', () => {
//      assert.ok(campaign.options.address);
//    // console.log(await web3.eth.getBalance(manager));
//    });
  
// });