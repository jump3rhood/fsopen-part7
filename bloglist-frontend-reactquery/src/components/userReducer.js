const userReducer = (state, action) => {
  switch(action.type){
  case 'SET':
    return action.payload
  case 'RESET':
    return null
  default:
    return null
  }
}

export default userReducer