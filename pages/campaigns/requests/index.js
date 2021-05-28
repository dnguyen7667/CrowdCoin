import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {Link, Router} from '../../../routes';
import {Button, Table,Modal, Header, Icon, Segment, Loader, Grid} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import ModalError from '../../../components/ModalError';
import ModalSuccess from '../../../components/ModalSuccess';
import ModalLoader from '../../../components/ModalLoader';
import MessageError from '../../../components/MessageError';
import MessageSuccess from '../../../components/MessageSuccess';




class CampaignRequests extends Component{
    constructor(props){
        super(props);
        // this.closeErrorBox = this.closeErrorBox.bind(this);
        const status = ['error', 'success'];
        const statusIconName = ["exclamation circle", "hand peace outline"];
        const statusIconColor = ['red', 'green'];
        const outMessage = ['Failed to process the request. Please try again!', "Successfully process the request!"];
        const outHeader = ["Uh-Oh...","Success!"];

        const Mapper = (keys, values) => {
            const map = new Map();
            for(let i = 0; i < keys.length; i++){
                map.set(keys[i], values[i]);
            };
            return map;
        };

        this.statusIconNameMapper = Mapper(status, statusIconName);
        this.statusIconColorMapper = Mapper(status, statusIconColor);
        this.statusMessageMapper = Mapper(status, outMessage);
        this.statusHeaderMapper = Mapper(status, outHeader);


    }

    // state = {
    //     error: false,
    //     loading: false,
    //     errorMessage: '',
    //     actionSuccess: false,
    //     test: true
    // };
    state = {
        modalOpen: false,
        loading: false,
        iconName: '',
        iconColor: '',
        contentHeader : '',
        contentDetails: '',
        modalStatus: ''
    };

    static async getInitialProps(props){
        const address = props.query.address;
        const campaign = await Campaign(address);

        let approversCount = await campaign.methods.approversCount().call();
        approversCount = parseInt(approversCount);

        let requestsCount;
        requestsCount = await campaign.methods.requestsCount().call();
        requestsCount = parseInt(requestsCount);

        const requestDetails = await Promise.all(
            Array(requestsCount)
                .fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );
        
        return {  
                    address: address,
                    requestsCount: requestsCount,
                    requestDetails: requestDetails,
                    approversCount: approversCount};

    }

    // after each task success or not, stop the loading modal, then reload the page to update info
    afterEachTask = () => {
        this.setState({loading: false});
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

    }

    //  to get the status icon and icons color for the state of the request
    getStatusIcon = (status) => {
        // const modalStatus = status;
        const icon = this.statusIconNameMapper.get(status);
        const iconColor = this.statusIconColorMapper.get(status);
        const contentDetails = this.statusMessageMapper.get(status);
        const contentHeader = this.statusHeaderMapper.get(status);

        // console.log("in getStatusIcon: " + icon + iconColor);

        this.setState({modalOpen: true, contentHeader: contentHeader, 
                    contentDetails: contentDetails, modalStatus: status,
                    iconName:icon, iconColor: iconColor});
    }

    onFinalizeRequest = async(event) =>{
        event.preventDefault();
        console.log(this.props.address);

        this.setState({modalOpen: false, contentHeader:'',  contentDetails:'', loading: true, modalStatus: '', loading: true});
        
        const requestIndex = event.target.value;
        
        try {
            const campaign = Campaign(this.props.address);

            const accounts = await web3.eth.getAccounts();
            // console.log(accounts);

            await campaign.methods.finalizeRequest(requestIndex).send({from: accounts[0]});

            const modalStatus = 'success';
            this.getStatusIcon(modalStatus);
            

        } catch(err){
            const modalStatus = 'error';
            this.getStatusIcon(modalStatus);

        }
        
        this.afterEachTask();
    }


    onApproveRequest = async (event) => {

        event.preventDefault();

        this.setState({error: false, errorMessage:'', loading: true, actionSuccess: false});
         
        const requestIndex = event.target.value;
        try {

            // console.log(this.props.campaign); 
            // console.log(Campaign(this.props.address));

            const campaign = Campaign(this.props.address);

            const accounts = await web3.eth.getAccounts();
            // console.log(accounts);

            await campaign.methods.approveRequest(requestIndex).send({from: accounts[0]});

            const modalStatus = 'success';
            this.getStatusIcon(modalStatus);
            
        } catch(err){
           
            const modalStatus = 'error';
            this.getStatusIcon(modalStatus);        
        }
        
        this.afterEachTask();
        
    }


    renderRequestDetails () {
        let tableData = [];

        for (let i = 0; i < this.props.requestsCount; i++){
 
            tableData.push({
                index: i + 1,
                description: this.props.requestDetails[i][0],
                value: web3.utils.fromWei(this.props.requestDetails[i][1], 'ether'),
                recipient: this.props.requestDetails[i][2],
                approvalCount: this.props.requestDetails[i][4] + "/" + this.props.approversCount,
                approve: !this.props.requestDetails[i][3],
                completed: this.props.requestDetails[i][3]
                });
        }

        const renderBodyRow = ({ index, description, value, recipient, approvalCount,  approve, completed}, i) => ({
                // key: name || `row-${i}`,
                // warning: !!(status && status.match('Requires Action')),
                cells: [
                    index , description, value, recipient, approvalCount, 

                    approve ? {key: "approve", content: <Button primary value = {index-1} onClick={this.onApproveRequest}>Approve</Button>} 
                            : {key: "approve", content: <Button primary disabled={!approve} color='red'>Approve</Button>, negative: approve}, 

                    completed ? {key: "completed", content: <Button primary color='red' disabled={completed}>Finalized!</Button>, positive: completed} 
                            : {content: <Button primary value = {index-1} onClick={this.onFinalizeRequest}>Finalize</Button>, positive: !completed}
                ],
                })


        const headerRow = ['ID', 'Description', 'Amount (in ether)', 'Recipient', 'Approval Count', 'Approve', 'Finalize'];

        return <Table
            celled
            headerRow={headerRow}
            renderBodyRow={renderBodyRow}
            tableData={tableData}
        />

    }


    render(){
        return (
            <Layout>
                <h1>Requests</h1>
                {/* Link to click to create new request */}
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: '10px'}}>Create New Request!</Button>
                    </a>
                </Link>

                {this.renderRequestDetails()}

                {/* Modal error for approve request */}
                {/* <MessageError error={this.state.modalOpen} errorMessage={this.state.errorMessage} /> */}
                <ModalLoader loading={this.state.loading}  />
                {/* <MessageSuccess success={this.state.actionSuccess} /> */}
                <ModalSuccess modalOpen={this.state.modalOpen} 
                                iconName= {this.state.iconName} iconColor={this.state.iconColor}
                                contentHeader={this.state.contentHeader} contentDetails={this.state.contentDetails}
                                closeModalFromChild={()=>this.setState({modalOpen: false})}/>
                

                {/* <ModalError error={this.state.error} errorMessage={this.state.errorMessage} closeErrorBoxFromChild={()=>this.setState({error: false})} />     
                <Modal boxOpen={this.} */}
            </Layout>
        );
    }
}

export default CampaignRequests;