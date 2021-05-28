import web3 from './web3';
import Campaign from './build/Campaign.json'; 

const campaignABI = Campaign["abi"];

export default function Main (address) {
    return new web3.eth.Contract(campaignABI, address);
}