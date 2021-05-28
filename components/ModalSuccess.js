import React, { Component } from 'react';
import { Modal, Header, Icon, Segment, Button} from 'semantic-ui-react';


// class ModalSuccess extends Component{
class ModalSuccess extends Component {
    
    
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
                open={this.props.modalOpen}
                size='small'
                dimmer = "blurring"
                >
                <Header icon>
                   <Icon name={this.props.iconName} size="mini" color={this.props.iconColor}></Icon>
                    {this.props.contentHeader}
                </Header>
                <Segment basic textAlign={"center"}>
                    <Modal.Content style={{textAlign: "center"}} content={this.props.contentDetails} />
                </Segment>
                <Modal.Actions>
                    <Button color='red' dimmer="blurring" onClick={this.props.closeModalFromChild}>
                        <Icon />OK
                    </Button>
                    
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ModalSuccess;