import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { useAuth } from '../../components/AuthProvider'
import Button from '../../components/Button'

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      success
    }
  }
`

const DATE_FORMAT = 'MMMM Do YYYY hh:mm ZZ'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: whitesmoke;
  border-radius: 4px;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid lightgrey;
`

const Identification = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    margin-right: 8px;
  }
`

const UserName = styled(Typography).attrs({ variant: 'subtitle1', component: 'span' })`
  margin: 0 8px;
`

const Comment = ({ id, body, createdAt, userId, userName, userAvatarUrl }) => {
  const { currentUser } = useAuth()
  const client = useApolloClient()
  const [doDeleteComment] = useMutation(DELETE_COMMENT_MUTATION, { variables: { commentId: id }})

  const deleteComment = async _ => {
    await doDeleteComment()
    client.resetStore()
  }

  return (
    <Root>
      <MainContainer>
        <TopRow>
          <Identification>
            <Avatar src={userAvatarUrl} alt={userName} />
            <UserName>{userName}</UserName>
          </Identification>

          <Typography variant='caption'>
            {moment(createdAt).format(DATE_FORMAT)}
          </Typography>
        </TopRow>

        <Typography variant='body1' component='span'>{body}</Typography>
      </MainContainer>

      {currentUser && parseInt(userId) === parseInt(currentUser.id) && (
        <Actions>
          <Button startIcon={<DeleteForeverIcon />} onClick={deleteComment}>Delete</Button>
        </Actions>
      )}
    </Root>
  )
}

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userAvatarUrl: PropTypes.string.isRequired
}

export default Comment
