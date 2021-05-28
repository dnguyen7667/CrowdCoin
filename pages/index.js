import React, {Component} from 'react';
import factory from '../ethereum/factory';
import {Card, Button} from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/Layout';
import {Link} from '../routes';

class CampaignIndex extends Component{
    // async componentDidMount() {
    //     const campaigns = await factory.methods.getDeployedCampaigns().call();

    //     console.log(campaigns);
    // }

    static async getInitialProps(){ // bc we want to get the initial data without rendering the component
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        // console.log(factory);

        return {campaigns: campaigns}; // this will be an object  this.props

    }

    
    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                    ),
                fluid: true
            }
        });

        return <Card.Group items={items} />;
    }


    render() {
        return (
            <Layout> 
                <div>            
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a className="item">
                            <Button floated="right"
                            content="Create Campaign"
                            icon="add circle"
                            primary={true} 
                            />
                        </a>

                    </Link>
         
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;
