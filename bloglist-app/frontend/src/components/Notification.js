import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if(!message.content){
    return
  }
  return (
    <div className={message.class}>
      {message.content}
    </div>
  )
}

export default Notification


