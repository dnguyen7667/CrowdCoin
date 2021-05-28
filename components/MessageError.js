import React from 'react'
import { Message } from 'semantic-ui-react'

const MessageError = (props) => (
  <Message
    floating
    hidden={!props.error}
    error
    header='ERROR!'
    content= {props.errorMessage}
    icon="exclamation circle"
    compact
    style={{'overflow-wrap': 'break-word'}}
  />
)

export default MessageError;