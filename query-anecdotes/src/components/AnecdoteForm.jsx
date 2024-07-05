import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../services/anecdotes'
import { useNotification, showNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()
  const mutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: (error) => {
      showNotification(dispatch, error.response.data.error || 'Error creating anecdote')
    }
  })

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value
    if (content.length >= 5) {
      mutation.mutate({ content, votes: 0 })
      showNotification(dispatch, `Anecdote '${content}' created`)
      event.target.anecdote.value = ''
    } else {
      showNotification(dispatch, 'Too short anecdote, must have length 5 or more')
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
