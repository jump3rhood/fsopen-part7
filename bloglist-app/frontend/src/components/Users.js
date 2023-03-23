import React, { useState, useEffect } from 'react'
import Notification from './Notification'
import { useSelector } from 'react-redux'
import userService from '../services/users'
const Users = () => {
  const user = useSelector(state => state.user)
  const [users,setUsers] = useState([])
  useEffect(() => {
    userService.getAll().then(allUsers => setUsers(allUsers))
  }, [])
  console.log(users)
  if(user === null){
    return <div>
      <h2>blogs</h2>
      <Notification/>
      <p>Login to view users</p>
    </div>
  }
  const usersTable = users.map(user => <tr key={user.username}>
    <td>{user.name}</td>
    <td>{user.blogs ? user.blogs.length : 0}</td>
  </tr>)
  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <div>
        { user
          ? <>
            <p>{user.name} logged in</p>
          </>
          : ''}
      </div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {usersTable}
        </tbody>
      </table><br />
    </div>
  )
}

export default Users