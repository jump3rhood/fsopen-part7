import React from 'react'
import { Link } from 'react-router-dom'
import Notification from './Notification'

const Users = ({ users }) => {

  const usersTable = users.map(user => <tr key={user.username}>
    <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
    <td>{user.blogs ? user.blogs.length : 0}</td>
  </tr>)

  return (
    <div>
      <Notification/>
      <h2>Users</h2>
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