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

const structuredData = post => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://nicolasoga.com.ar/posts/${post.slug}`
  },
  headline: post.plainTextTitle,
  image: post.cover,
  datePublished: post.date,
  dateModified: post.date,
  author: {
    '@type': 'Person',
    name: 'Nicolas Oga'
  },
  description: post.description
})

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
    <script type="application/ld+json">
      {structuredData(post)}
    </script>
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
