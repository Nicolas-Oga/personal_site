import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'

import setDocumentTitle from '../setDocumentTitle'
import posts from '../posts'
import CommentHub from '../components/CommentHub'
import PostSectionTitle from '../components/PostSectionTitle'

const DATE_FORMAT = 'MMMM Do YYYY'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 24px;
  box-sizing: border-box;

  ${breakpoint('desktop')`
    flex-direction: row;
    align-items: flex-end;
  `}
`

const HeaderRightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-shrink: 0;
`

const Heading = styled(Typography).attrs({ variant: 'h4', component: 'h1' })``

const FlexSpacer = styled.div`
  flex-grow: 1;
`

const PostViewer = ({ match }) => {
  const post = posts.find(p => p.slug === match.params.slug)
  const Component = post.component

  setDocumentTitle({ subtitle: post.plainTextTitle || post.title })

  return <div>
    <Header>
      <Heading>{post.title}</Heading>
      <FlexSpacer />
      <HeaderRightSide>
        <Typography variant='body1'>{moment(post.date).format(DATE_FORMAT)}</Typography>
      </HeaderRightSide>
    </Header>

    <Component />

    <PostSectionTitle>Comments</PostSectionTitle>

    <CommentHub postSlug={post.slug} />
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
