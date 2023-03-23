import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if(!message.content){
    return
  }
  return (
    <Alert variant={message.class}>
      {message.content}
    </Alert>
  )
}

export default Notification


