import React, { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload;
    case 'HIDE':
      return ''
    default:
      return state
  }
}

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const showNotification = (dispatch, message) => {
  dispatch({ type: 'SHOW', payload: message })
  setTimeout(() => {
    dispatch({ type: 'HIDE' })
  }, 5000)
}