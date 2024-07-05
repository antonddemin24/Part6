import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { setNotificationWithTimeout } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1 
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      ).sort((a, b) => b.votes - a.votes)
    },
    addAnecdote(state, action) {
      state.push(action.payload)
      return state.sort((a, b) => b.votes - a.votes)
    },
  },
})

export const { setAnecdotes, voteAnecdote, addAnecdote } = anecdoteSlice.actions

export const fetchAnecdotes = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:3001/anecdotes')
      dispatch(setAnecdotes(response.data))
    } catch (error) {
      console.error('Error fetching anecdotes:', error)
    }
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    try {
      const anecdoteObject = {
        content,
        votes: 0
      }
      const response = await axios.post('http://localhost:3001/anecdotes', anecdoteObject)
      dispatch(addAnecdote(response.data))
      dispatch(setNotificationWithTimeout(`new anecdote '${content}'`, 5))
    } catch (error) {
      console.error('Error creating anecdote:', error)
    }
  }
}

export const voteAnecdoteAsync = (id) => {
  return async (dispatch, getState) => {
    try {
      const anecdoteToVote = getState().anecdotes.find(a => a.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      const response = await axios.put(`http://localhost:3001/anecdotes/${id}`, votedAnecdote)
      dispatch(voteAnecdote(response.data.id))
      dispatch(setNotificationWithTimeout(`you voted '${anecdoteToVote.content}'`, 5))
    } catch (error) {
      console.error('Error voting anecdote:', error)
    }
  }
}

export default anecdoteSlice.reducer


