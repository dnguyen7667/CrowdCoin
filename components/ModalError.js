import React, { Component } from 'react';
import { Modal, Header, Icon, Segment, Button} from 'semantic-ui-react';


// class ModalError extends Component{
class ModalError extends Component {
    
    
    constructor(props){
        super(props);
        // const [open, setOpen] = React.useState(false);
        
        // this.state = {modalOpen: true};
    }
    
    render() {
        // this.setState({modalOpen: true})
        return (
             <Modal
                closeOnEscape={true}
                closeOnDimmerClick={true}
                basic
                open={this.props.error}
                size='small'
                dimmer = "blurring"
                >
                <Header icon>
                   <Icon name="exclamation triangle" size="mini" color= "red"></Icon>
                    ERROR!
                </Header>
                <Segment basic textAlign={"center"}>
                    <Modal.Content style={{textAlign: "center"}} content={this.props.errorMessage} />
                </Segment>
                <Modal.Actions>
                    <Button color='red' dimmer="blurring" onClick={this.props.closeErrorBoxFromChild}>
                        <Icon name='checkmark' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}


export default ModalError;


// /* Modal for loading */}
//             <Modal
//                 basic
//                 open={this.state.loading}
//                 size='small'
//                 dimmer = "blurring"
//                 >
//                     <Loader>
//                             Registering you as a campaign approver! This may take a few moments...
//                     </Loader>
//              </Modal>


//             {/* Modal to confirm successfully contribute to campaign */}
//             <Modal
//                 basic
//                 open={this.state.contributionConfirmed}
//                 size='small'
//                  dimmer = "blurring"
//                 >
//                 <Header icon>
//                    <Icon name="rocket" size="mini" color= "green" loading></Icon>
//                     Thank you for your contribution!
//                 </Header>
//                 <Segment basic textAlign={"center"}>
//                     <Modal.Content style={{textAlign: "center"}} content="You can now participate in approving open requests." />
//                 </Segment>
//                 <Modal.Actions>
//                     <Button color='green' dimmer="blurring" onClick={event => {this.setState({contributionConfirmed: false})}}>
//                         <Icon name='checkmark' /> Ok
//                     </Button>
//                 </Modal.Actions>
//             </Modal>

//             {/* Modal for error */}
//             <Modal
//                 basic
//                 open={this.state.errorModal}
//                 size='small'
//                 dimmer = "blurring"
//                 >
//                 <Header icon>
//                    <Icon name="exclamation triangle" size="mini" color= "red"></Icon>
//                     ERROR!
//                 </Header>
//                 <Segment basic textAlign={"center"}>
//                     <Modal.Content style={{textAlign: "center"}} content={this.state.error} />
//                 </Segment>
//                 <Modal.Actions>
//                     <Button color='red' dimmer="blurring" onClick={event => {this.setState({errorModal: false})}}>
//                         <Icon name='checkmark' /> Ok
//                     </Button>
//                 </Modal.Actions>
//             </Modal>