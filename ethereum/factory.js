import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import {address} from './getFactoryAddress';


const campaignFactoryABI = CampaignFactory["abi"];

// let instance;

function getInstance (){
    const instance = new web3.eth.Contract(campaignFactoryABI, address);
    return instance;
}

const instance = getInstance();
// const instance = await new web3.eth.Contract(campaignFactoryABI, address);
// console.log(instance);
export default instance;
