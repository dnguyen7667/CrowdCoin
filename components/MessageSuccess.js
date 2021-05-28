import React from 'react'
import { Message, Icon} from 'semantic-ui-react'

const MessageSuccess = (props) => (
  <Message
    floating
    hidden={!props.success}
    positive
    header='SUCCESS!'
    content= {"Action success!"}
    icon="hand peace outline"
    compact = {true}
  >
  
    
  </Message>
)

export default MessageSuccess;