import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogsReducer from './blogReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer
  }
})
export default store