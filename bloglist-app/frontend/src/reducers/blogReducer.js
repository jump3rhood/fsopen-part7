import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action){
      return action.payload
    },
    appendBlog(state,action){
      state.push(action.payload)
    },
    updateBlogLikes(state, action){
      return [action.payload, ...state.filter(blog => blog.id !== action.payload.id)]
    },
    removeBlog(state, action){
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}
export const createBlog = (blogObj) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(blogObj)
    dispatch(appendBlog(createdBlog))
  }
}
export const updateBlog = (id, blogObj) => {
  return async (dispatch) => {
    const updated = await blogService.update(id, blogObj)
    dispatch(updateBlogLikes(updated))
  }
}
export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteOne(id)
    dispatch(removeBlog(id))
  }
}
export const { setBlogs, appendBlog, updateBlogLikes, removeBlog } = blogSlice.actions
export default blogSlice.reducer