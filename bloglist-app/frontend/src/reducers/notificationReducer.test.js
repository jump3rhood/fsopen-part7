import notificationReducer from './notificationReducer'
import deepFreeze from 'deep-freeze'

describe('Notification reducer', () => {
  test('return a new state with action notification/newNotification', () => {
    const state = {}
    const action = {
      type: 'notification/newNotification',
      payload: {
        class: 'success',
        content: 'i must work'
      }
    }
    deepFreeze(state)
    const newState = notificationReducer(state, action)

    expect(newState).toBeDefined()
    expect(newState.content).toEqual(action.payload.content)
  })
})