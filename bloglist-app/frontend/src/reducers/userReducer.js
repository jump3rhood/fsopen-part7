import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setAndStoreUser(state, action){
      const user = action.payload
      const userJSON = JSON.stringify(user)
      window.localStorage.setItem('loggedBlogAppUser', userJSON)
      return action.payload
    },
    resetAndRemoveUser(state, action){
      window.localStorage.removeItem('loggedBlogAppUser')
      return null
    },
    setSavedUser(store, action){
      return action.payload
    }
  }
})
export const initializeUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    dispatch(setAndStoreUser(user))
  }
}
export const { setAndStoreUser, resetAndRemoveUser, setSavedUser } = userSlice.actions
export default userSlice.reducer