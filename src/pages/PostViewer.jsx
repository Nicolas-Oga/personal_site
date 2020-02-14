import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'

import posts from '../posts'

const DATE_FORMAT = 'MMMM Do YYYY'

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 24px;
`

const HeaderRightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

const Heading = styled(Typography).attrs({ variant: 'h4', component: 'h1' })``

const FlexSpacer = styled.div`
  flex-grow: 1;
`

const P = styled(Typography).attrs({ variant: 'body1', paragraph: true })``

const PostViewer = ({ match }) => {
  const post = posts.find(p => p.slug === match.params.slug)
  const Component = post.component
  return <div>
    <Header>
      <Heading>{post.title}</Heading>
      <FlexSpacer />
      <HeaderRightSide>
        <Typography variant='body1'>{moment(post.date).format(DATE_FORMAT)}</Typography>
      </HeaderRightSide>
    </Header>

    <Component />
  </div>
}

PostViewer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default PostViewer