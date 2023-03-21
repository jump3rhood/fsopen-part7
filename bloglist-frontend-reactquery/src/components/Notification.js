import React, { useContext } from 'react'
import NotificationContext from './NotificationContext'
const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  console.log(notification)
  if(notification === null)
    return
  return (
    <div className={notification.class}>
      {notification.content}
    </div>
  )
}

export default Notification