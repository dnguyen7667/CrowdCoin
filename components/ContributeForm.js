import React, { Component } from 'react';
import { Button, Form, Input, Message, Progress, Confirm,  Select, TextArea, Segment, Label, Icon, Header, Modal,Dimmer, Loader, Popup} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';



class ContributeForm extends Component{

    state = {
        contribAmount: '',
        confirmBoxShowed: false,
        error: '',
        contributionConfirmed: false,
        errorModal: false,
        loading: false // while processing, show loading icon
    };
    

    // const [open, setOpen] = React.useState(false);

    openConfirmBox = () => {this.setState({confirmBoxShowed:true})}
    closeConfirmBox = () => {this.setState({confirmBoxShowed:false})}


    onAmountChange = async (event) => {
        this.setState({contribAmount: event.target.value});
    }


    onContributeConfirmed = async(event) => {
        event.preventDefault(); 
        this.setState({contributionConfirmed: false, errorModal: false});

        const campaign = Campaign(this.props.address);

        // check if user contribute the minimum to the campaign
        try{
            this.setState({loading: true, confirmBoxShowed: false});
            // console.log(campaign);
            const amountInWei = await web3.utils.toWei(this.state.contribAmount, "ether");
            // console.log(amountInWei);

            const accounts = await web3.eth.getAccounts();
            const contributor = await accounts[0];
            await campaign.methods.contribute().send({from: contributor, value: amountInWei});
            this.setState({contributionConfirmed: true});
            // should also update approvers count
            // await sleep(5);

             Router.replaceRoute(`/campaigns/${this.props.address}`);


        } catch (err){
            this.setState({error: err.message, errorModal: true});

        }

        this.closeConfirmBox(); // close confirm box
        this.setState({confirmBoxShowed: false, loading: false});

    }


    render(){
        return (
        <Form>
            <Form.Field>
                <label>Contribute to this campaign!</label>
                <Input 
                    value = {this.state.contribAmount}
                    onChange={this.onAmountChange}
                    label='ether' labelPosition='right'
                />
            </Form.Field>
            <Segment basic textAlign={"center"}>
                <Button primary
                        disabled={this.state.loading}
                        style={{textAlign: "center"}}
                        onClick={this.openConfirmBox}>
                    Contribute!
                </Button>
            </Segment>

            <Confirm open={this.state.confirmBoxShowed}
                    onConfirm={this.onContributeConfirmed}
                    onCancel={this.closeConfirmBox}
                    content={"Confirm to contribute " + this.state.contribAmount + " ether to this campaign?"}
                    confirmButton="Confirm"
                    cancelButton="Cancel">
            </Confirm>

            {/* Modal for loading */}
            <Modal
                basic
                open={this.state.loading}
                size='small'
                dimmer = "blurring"
                >
                    <Loader>
                            Registering you as a campaign approver! This may take a few moments...
                    </Loader>
             </Modal>


            {/* Modal to confirm successfully contribute to campaign */}
            <Modal
                basic
                open={this.state.contributionConfirmed}
                size='small'
                 dimmer = "blurring"
                >
                <Header icon>
                   <Icon name="rocket" size="mini" color= "green" loading></Icon>
                    Thank you for your contribution!
                </Header>
                <Segment basic textAlign={"center"}>
                    <Modal.Content style={{textAlign: "center"}} content="You can now participate in approving open requests." />
                </Segment>
                <Modal.Actions>
                    <Button color='green' dimmer="blurring" onClick={event => {this.setState({contributionConfirmed: false})}}>
                        <Icon name='checkmark' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* Modal for error */}
            <Modal
                basic
                open={this.state.errorModal}
                size='small'
                dimmer = "blurring"
                >
                <Header icon>
                   <Icon name="exclamation triangle" size="mini" color= "red"></Icon>
                    ERROR!
                </Header>
                <Segment basic textAlign={"center"}>
                    <Modal.Content style={{textAlign: "center"}} content={this.state.error} />
                </Segment>
                <Modal.Actions>
                    <Button color='red' dimmer="blurring" onClick={event => {this.setState({errorModal: false})}}>
                        <Icon name='checkmark' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
       
        </Form>


    );


}
}

export default ContributeForm;

