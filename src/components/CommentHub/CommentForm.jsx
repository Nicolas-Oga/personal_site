import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useForm, useField } from 'react-final-form-hooks'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import extractGqlValidationErrors from '../../extractGqlValidationErrors'
import { useAuth } from '../../components/AuthProvider'

import MuiTextField from '@material-ui/core/TextField'
import MuiAvatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SendIcon from '@material-ui/icons/Send'

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
    }
  }
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
`

const MainContainer = styled(Paper)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const Hint = styled.div`
  display: flex;
  justify-content: flex-end;
  color: grey;
  transition: opacity 300ms;
`

const Avatar = styled(MuiAvatar)`
  margin: 0 8px !important;
`

const TextField = styled(MuiTextField)`
  flex-grow: 1;
`

const CommentForm = ({ postSlug }) => {
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { currentUser, logIn } = useAuth()
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION)
  const client = useApolloClient()

  const { handleSubmit, form } = useForm({
    async onSubmit({ body }) {
      if (!body || !body.trim()) { return }

      setSubmitting(true)

      if (!currentUser) { await logIn() }

      try {
        await createComment({ variables: { input: { postSlug, body }}})
        client.resetStore()
        setTimeout(_ => form.reset())
      } catch (error) {
        return extractGqlValidationErrors(error)
      }

      setSubmitting(false)
    }
  })

  const body = useField('body', form)

  const onKeyDown = ev => ev.key === 'Enter' && (ev.ctrlKey || ev.shiftKey) && form.submit()

  return (
    <form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
      <MainContainer>
        <Avatar
          src={currentUser && currentUser.avatarUrl}
          alt={currentUser && currentUser.name}
        />

        <TextField
          label='Submit your comment'
          variant='filled'
          multiline
          rows='2'
          inputProps={{
            onFocus: _ => setFocused(true),
            onBlur: _ => setFocused(false)
          }}
          disabled={submitting}
          {...body.input}
        />

        <IconButton type='submit' disabled={submitting}>
          <SendIcon />
        </IconButton>
      </MainContainer>

        <Hint style={{ opacity: focused ? 1 : 0 }}>
          <Typography variant='caption'>Ctrl + Enter will submit the comment</Typography>
        </Hint>
    </form>
  )
}

CommentForm.propTypes = {
  postSlug: PropTypes.string.isRequired
}

export default CommentForm
