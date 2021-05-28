const fs = require('fs-extra');
const solc = require('solc');
const path = require('path');

// remove existing build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);


//create a new Folder for compiled code named byuld
fs.ensureDirSync(buildPath);


// read in source code
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf-8');


var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 


const output = JSON.parse(solc.compile(JSON.stringify(input)));
const interface = output["contracts"]["Campaign.sol"]["Campaign"]["abi"];
const bytecode = output["contracts"]["Campaign.sol"]["Campaign"]["evm"]["bytecode"]["object"];


const contracts = output["contracts"]["Campaign.sol"];
for (let contract in contracts){
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        contracts[contract]

    
    );
}



// console.log(output["contracts"]["Campaign.sol"]["CampaignFactory"]["abi"]);

// module.exports = {interface, bytecode}
