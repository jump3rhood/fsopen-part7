import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = (id) => {
    const { title, author, url, likes } = blog
    dispatch(updateBlog(id, { title, author, url, likes: likes+1 }))
  }

  return (
    <div style={blogStyle} className='blog'>
      <h1>{blog.title}</h1>
      <p className='url'><a href={blog.url}>{blog.url}</a></p>
      <p className='likes'>{blog.likes} <button onClick={() => updateLikes(blog.id)}>like</button></p>
      <p>{blog.author}</p>
      {user.name !== blog.user.name
        ? ''
        : <button onClick={() =>  {
          dispatch(deleteBlog(blog.id))
          dispatch(notify({
            class: 'success',
            content: `deleted ${blog.title}`
          }))
        } }>remove</button>
      }
    </div>
  )
}

export default Blog

