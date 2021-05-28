const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs');
const compiledCampaignFactory = require('./build/CampaignFactory.json');
const compiledCampaign = require('./build/Campaign.json');

// // campaign abi and bytecode
// const campaignABI = compiledCampaign["abi"];
// const campaignBytecode = compiledCampaign["evm"]["bytecode"]["object"];


// campaign abi and bytecode
const campaignFactoryABI = compiledCampaignFactory["abi"];
const campaignFactoryByteCode = compiledCampaignFactory["evm"]["bytecode"]["object"];



// read in backup phrase for metamask
const phrase = fs.readFileSync('../../phrase.txt', 'utf8');
const infura = fs.readFileSync('../../infura.txt', 'utf8');

// get provider

const provider = new HDWalletProvider(
    // pneumonic
    phrase
    ,
    // link to infura api
    infura
);

let factoryAddress;

web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const MANAGER = accounts[0];// contract manager

    try {
        const contract = await new web3.eth.Contract(campaignFactoryABI)
                        .deploy({data: campaignFactoryByteCode})
                        .send({from: MANAGER, gas: '4000000'});

     
        // console.log("Accounts address: ", MANAGER);
        // console.log(interface);
        factoryAddress = contract.options.address;

        console.log("Contract address: ", factoryAddress);
        fs.appendFile("contractAddresses.txt", "\n" + factoryAddress, (error) => {
            if (error) throw error;
        })

    }
    catch(err){
        console.log(err);
    }
    


}

// module.exports = {factoryAddress};
deploy();



// ADDRESS: 0x5690b770EB8718A622bEB0E0B032DFC4e0D64B87
// ADDRESS: 0x3FdAfa1E66bE6D6852bBD69Ed86a455cF6b421b7