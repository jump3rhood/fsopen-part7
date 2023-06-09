import React from 'react'

const User = ({ user }) => {

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
    </div>
  )
}

export default User