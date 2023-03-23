import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBlog, deleteBlog, commentOnBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

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

  const handleAddComment = (e) => {
    e.preventDefault()
    if(!comment) return
    dispatch(commentOnBlog(blog.id, comment))
    setComment('')
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
      <br />
      <form onSubmit={handleAddComment}>
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}/>
        <button>add comment</button>
      </form>
      <h3>Comments</h3>
      {blog.comments.length === 0 ? <em>No comments yet</em> : blog.comments.map((comment,i) => <li key={i}>{comment}</li>)}
    </div>
  )
}

export default Blog

