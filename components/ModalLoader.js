import { Modal, Header, Icon, Segment, Button, Loader} from 'semantic-ui-react';
import React, { Component } from 'react';


class  ModalLoader extends Component {
    constructor(props){
        super(props);

    }


    render(){
        // let loading = this.props.loading;
        // console.log("this.loading "+ this.loading);
        // console.log("this.props.loading: " + this.props.loading);

        return (
            <Modal
                basic
                open={this.props.loading}
                size='small'
                dimmer = "blurring"
                >
                    <Loader>
                            Processing. This may take a few moments...
                    </Loader>
            </Modal>

        );
    }
}

export default ModalLoader;