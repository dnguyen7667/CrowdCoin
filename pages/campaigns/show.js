// to show details about some particular campaign
import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button, Popup} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props){
        const address = props.query.address;
        const campaign = Campaign(address);

        const campaignSummary = await campaign.methods.getCampaignSummary().call();
        // console.log(campaignSummary);

        return {campaignMinimumContribution: campaignSummary[0],
            campaignTitle: campaignSummary[1], 
            campaignDescription: campaignSummary[2],
            campaignBalance: campaignSummary[3],
            campaignRequestsCount: campaignSummary[4],
            campaignApproversCount: campaignSummary[5],
            campaignManager: campaignSummary[6],
            address: address};
    }

    renderDetails() {

        const items = [
        {
            header: 'Campaign Details',
            meta: 'Detailed description of the campaign...',
            description: this.props.campaignDescription
            
        },
        {
            header: 'Campaign Manager',
            meta: 'Address of the campaign\'s manager',
            description: this.props.campaignManager,
            style: {overflowWrap: 'break-word'}
            
        },
        {
            header: 'Campaign Balance',
             meta: 'Balance of the campaign (in ether)',
            description: web3.utils.fromWei(this.props.campaignBalance, 'ether')
           
        },
        {
            header: 'Minimum Contribution',
             meta: 'Mininum contribution (in wei) to approve campaign requests',
            description: this.props.campaignMinimumContribution
           
        },
        {
            header: 'Approvers Count',
            meta: 'Number of approvers for requests',
            description: this.props.campaignApproversCount,
            style: {overflowWrap: 'break-word'}
            
        },
        {
            header: 'Campaign Requests',
            meta: 'Number of requests existing in this campaigns',
            description: this.props.campaignRequestsCount,
            
        },
        ]

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign: {this.props.campaignTitle}</h3>
                <Grid>
                    {/* details of a campaign */}
                    <Grid.Column width={12}> 
                        {this.renderDetails()}
                    </Grid.Column>

                    {/* Contribute form */}
                    <Grid.Column width={4}>
                        <ContributeForm address={this.props.address}/>
                    </Grid.Column>

                    {/* Add button to view requests */}
                    <Link route={`/campaigns/${this.props.address}/requests`}>
                        <a>
                            <Button primary>View Requests </Button>                        
                        </a>
                    </Link>
                </Grid>
            </Layout>
        );
    }
}


export default CampaignShow;
