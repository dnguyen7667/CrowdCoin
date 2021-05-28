import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Input, TextArea, Button, Modal, Icon, Header, Table, Loader } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Router} from '../../../routes';


class CampaignRequestNew extends Component{
    static async getInitialProps(props){
        const address = props.query.address;

        // const campaign = Campaign(address);

        return {address: address};
    }

    state = {
        requestDescription: '',
        requestAmount: '',
        requestRecipientAddress: '',
        confirmBox: false,
        loading: false,
        errorMsg: '',
        error: '',
        success: false
    };

    openConfirmBox = () => {
        // check if all field required are filled

        
        this.setState({confirmBox:true});
    };
    closeConfirmBox = () => {this.setState({confirmBox:false})};


    onCreateRequest = async (event) =>{
        event.preventDefault(); // prevent browser from auto submitting the form

        this.setState({confirmBox:false, success: false});
        // console.log("Hello");

        try {
            this.setState({loading:true});
            // console.log("Hello in try");

            const accounts = await web3.eth.getAccounts();
            const campaignManager = accounts[0];

            const campaign = Campaign(this.props.address);
            // console.log("Before wei");
            

            // create new request for the campaign
            const amountInWei = await web3.utils.toWei(this.state.requestAmount, 'ether');
            
            // console.log(campaign);
            // console.log("wei:", amountInWei);

            await campaign.methods.createRequest(this.state.requestDescription, amountInWei, this.state.requestRecipientAddress)
                                    .send({from:campaignManager});
            
            
            this.setState({success:true});

            // Routing back to the request page
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);

        } catch (err) {
            this.setState({errorMsg:err.message, error: true});
            console.log("Error: " + err.message);
        }

        this.setState({loading:false});
    }


    onChangeInput = (event) => {
        this.setState({[event.target.id]: event.target.value, error: false});
    }

    render() {
        return (
            <Layout>

                <h3>Details for your new request:</h3>
                <Form>
                    <Form.Field required>
                        <label>Description</label>
                            <TextArea   id = "requestDescription"
                                        value = {this.state.requestDescription}
                                        required 
                                        onChange={this.onChangeInput}
                                        placeholder='Description of your new request' />
                    
                        <label>Recipient</label>
                            <Input  id = "requestRecipientAddress"
                                    value={this.state.requestRecipientAddress}
                                    onChange={this.onChangeInput}
                                    required 
                                    // error={this.state.requestRecipientAddress==''}
                                    placeholder='Address of the recipient of the request' />
                        
                        <label>Amount in ether</label>
                            <Input  id = "requestAmount"
                                    value={this.state.requestAmount}
                                    onChange={this.onChangeInput}
                                    required 
                                    placeholder='Amount in ether for the request' />

                        <Button onClick={this.openConfirmBox}
                                style={{marginTop: '20px'}} 
                                primary> Create! </Button>
                        
                        {/* Modal box to confirm creating request */}
                        <Modal dimmer = "blurring"
                            basic
                            open={this.state.confirmBox}
                            size='small'
                            >
                            <Header icon>
                                <Icon name='question circle' />
                                     Are you sure to create this request?
                            </Header>
                           
                            <Modal.Actions>
                                <Button basic color='red' onClick={this.closeConfirmBox}>
                                <Icon name='remove' /> No
                                </Button>
                                <Button color='green'  onClick={this.onCreateRequest}>
                                <Icon name='checkmark' /> Yes
                                </Button>
                            </Modal.Actions>
                        </Modal>

                        {/* Modal showing loading */}
                        <Modal dimmer = "blurring"
                            basic
                            open={this.state.loading}
                            size='small'
                            >
                          
                            <Modal.Content>
                                <Loader content="Creating the request. This may take a few moments..."/>
                            </Modal.Content>
                           
                        </Modal>

                        {/* Modal showing error */}
                        <Modal dimmer = "blurring"
                            basic
                            open={this.state.error}
                            size='small'
                            >
                            <Header icon>
                                <Icon name='exclamation triangle' color='red'/>
                                Error! 
                            </Header>
                            <Modal.Content>
                                <p>
                                    {this.state.errorMsg}
                                </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button basic color='red' onClick={even=>{this.setState({error: false})}}>
                                 <Icon name='remove' color= "red"/> Ok
                                </Button>
                               
                            </Modal.Actions>
                        </Modal>

                        {/* Modal showing successfully create request */}
                        <Modal dimmer = "blurring"
                            basic
                            open={this.state.success}
                            size='small'
                            >
                             <Header icon>
                                <Icon name='hand peace outline' color='green'/>
                                "Successfully create new request!"
                            </Header>
                          
    
                            <Modal.Actions>
                                <Button color='green' onClick={event=>{this.setState({success:false})}}>
                                    Great!
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        
                    </Form.Field>
                </Form>

            </Layout>
        );
    }
}

export default CampaignRequestNew;