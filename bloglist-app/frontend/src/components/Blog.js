import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBlog, deleteBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? 'none' : '' }
  const hideWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)
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
      <div style={showWhenVisible}>
        <p className='title'>{blog.title}</p>
        <p className='author'>{blog.author}</p>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={hideWhenVisible}>
        <p>{blog.title}</p>
        <button onClick={toggleVisibility}>hide</button>
        <p className='url'>{blog.url}</p>
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
    </div>
  )
}

export default Blog

