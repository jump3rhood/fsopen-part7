import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    content: '',
    class: 'success'
  },
  reducers: {
    newNotification(state, action){
      state.content = action.payload.content
      state.class = action.payload.class
    },
    resetNotification(state, action){
      state.content = ''
      state.class = 'success'
    }
  }
})
// thunk first sets, then resets after 5 seconds
export const notify = (message, timeInMs = 5000) => {
  return (dispatch) => {
    dispatch(newNotification(message))
    setTimeout(() => dispatch(resetNotification()), timeInMs)
  }
}
export const { newNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer