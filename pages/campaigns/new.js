import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Checkbox, Form, Input, Message, Progress, Confirm,  Select, TextArea, Segment, Label} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Link, Router} from '../../routes';


class CampaignNew extends Component {
    state = {minContrib: '',
            campaignTitle: '',
            campaignDescription:'',
            errorMessage: '',
            loading: false, 
            progress: '',
            progressActive: false,
            processing: '',
            processingPercent: 0,
            processingColor: 'grey', 
            buttonDisabled: false,
            newCampaignAddress: '',
            confirmBox: false,
            confirmCreateCampaign: false, 
            createButtonDisable: true};

    open = () => this.setState({ confirmBox: true })
    close = () => this.setState({ confirmBox: false})
    confirmCreateCampaign = () => this.setState({confirmCreateCampaign: true});
    
    onSubmit = async (event) => {
        
        event.preventDefault(); // prevent browser from auto submitting the form
        // this.setState({confirm: false});
        this.close();

        this.setState({loading:true, errorMessage: '', progressActive: true, processing: 'Creating a new campaign... This can take a few moments!', processingPercent: 0});

        try {
            this.setState({processingPercent: 50, processingColor: 'orange', buttonDisabled: true});
            const accounts = await web3.eth.getAccounts();
            const newCampaignCreator = await accounts[0];
        
            await factory.methods.createCampaign(this.state.minContrib, this.state.campaignTitle, this.state.campaignDescription)
                    .send({
                        from: newCampaignCreator
                    });

            // try to get the new campaign address
            const newCampaignAddresses = await factory.methods.getCampaignsByManager(newCampaignCreator).call();
            const newCampaignAddress = newCampaignAddresses[newCampaignAddresses.length - 1];
            // console.log(newCampaignAddresses);
            // console.log(newCampaignAddress);
            this.setState({processing: 'A new campaign was created successfully!', newCampaignAddress: "New Campaign Address: " + newCampaignAddress});

            Router.pushRoute('/');

        } catch(err){
            console.log(err);
            this.setState({errorMessage: err.message, processing: "ERROR: " + err.message});
        }

        this.setState({loading:false, progressActive: false, processingPercent: 100, processingColor: 'blue', buttonDisabled: false});
        
    };

    onChange = (event) => {
        this.setState({loading:false, errorMessage: '', progressActive: false, processing: '',
             processingPercent: 0, processingColor: 'grey', [event.target.id]:event.target.value});
        // this.setState({minContrib:event.target.value});

    };

    
    render() {
        return (
            <Layout>
                <h3>Create New Campaign!</h3>
                <Form>
                    <Form.Group widths='equal'>
                       {/* Title of the compaign goes here */}
                        <Form.Field>
                            <label>Campaign Title</label>
                            <Input id="campaignTitle"
                                value = {this.state.campaignTitle}
                                onChange={this.onChange}
                                placeholder='The title of your new campaign.'
                                    />
                        </Form.Field>

                        {/* Minimum contribution to the campaign to be marked as approver */}
                        <Form.Field>
                                <label>Minimum Contribution</label>
                                <Input id = "minContrib"
                                    value = {this.state.minContrib}
                                    onChange={this.onChange}
                                    label='wei' labelPosition='right'
                                    placeholder='Only whole number. E.x: 100' />
                        </Form.Field>
                    
                    </Form.Group>
                        
                    <Form.Group inline>
                
                    </Form.Group>
                        <Form.Field id = "campaignDescription"
                        control={TextArea}
                        onChange={this.onChange}
                        label='Campaign Description'
                        placeholder='More detailed description about your new campaign...'
                        />

                        {/* Check to agree with terms and conditions */}
                        <Form.Field>
                            <Checkbox label='I agree to the Terms and Conditions' onClick={event=>this.setState({createButtonDisable: !this.state.createButtonDisable})} />
                        </Form.Field>
        
                
                    <Segment basic textAlign={"center"}>
                        <Button 
                                style={{textAlign: "center"}}
                                onClick={this.open}
                                loading={this.state.loading}
                                type='submit' 
                                primary
                                disabled={this.state.createButtonDisable}
                                >Create!
                        </Button>
                    </Segment>
                    <Confirm 
                            open={this.state.confirmBox}
                            onCancel={this.close}
                            onConfirm={this.onSubmit}
                            content="Are you sure you want to create a new campaign?"
                            confirmButton="Yes"
                            />
                    <Progress  style={{marginTop: '10px'}} percent={this.state.processingPercent} active={this.state.progressActive} 
                            color={this.state.processingColor} error={this.state.errorMessage}> {this.state.processing} {this.state.newCampaignAddress} </Progress>
                </Form>

            </Layout>

        );
    }
}

export default  CampaignNew;