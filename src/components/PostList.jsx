import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import sortBy from 'lodash.sortby'

import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

import A from '../components/InlineHyperLink'
import posts from '../posts'

const DATE_FORMAT = 'MMMM Do YYYY'

const Root = styled.div`
  display: flex;
  flex-direction: column;

  > :not(:last-child) {
    margin-bottom: 16px;
  }
`

const FlexSpacer = styled.span`
  flex-grow: 1;
`

const Link = styled(RouterLink)`
  text-decoration: none;
`

const PostLink = styled.div`
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  padding: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: black;

  ${breakpoint('desktop')`
    flex-direction: row;
  `}
`

const PostLinkLeftSide = styled.div`
  ${breakpoint('mobile', 'tablet')`
    border-bottom: 1px solid lightgrey;
    margin-bottom: 8px;
  `}
`

const PostLinkRightSide = styled.div`
  display: flex;
  align-items: flex-end;
  ${breakpoint('desktop')`
    flex-direction: column;
  `}
`

const PostLinkTags = styled.div`
  text-align: right;
`

const NoPostsMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: whitesmoke;
  border-radius: 8px;
  text-align: center;
`

const PostList = ({ limit, filters: initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters)
  const { tagsInclude: includedTags, tagsExclude: excludedTags } = filters

  console.log({includedTags})

  const sortedPosts = sortBy(posts, p => -p.date.getTime())
  const filteredPosts = sortedPosts.slice(0, limit).filter(p =>
    (includedTags ? p.tags && includedTags.find(t => p.tags.includes(t)) : true) &&
    (excludedTags && p.tags ? !excludedTags.find(t => p.tags.includes(t)) : true)
  )

  return (
    <Root>
      {!filteredPosts.length && (
        <NoPostsMessage>
          <Typography variant='body1'>
            Sorry, there are no posts matching the given filters. <br />
            Try <A to='/all-posts' onClick={_ => setFilters({})}>resetting</A> them.
          </Typography>
        </NoPostsMessage>
      )}
      {filteredPosts.map((post, slug) =>
        <Link key={slug} to={`/posts/${post.slug}`}>
          <PostLink>
            <PostLinkLeftSide>
              <Typography variant='h6'>{post.title}</Typography>
              <Typography variant='subtitle1'>{post.description}</Typography>
            </PostLinkLeftSide>

            <FlexSpacer />

            <PostLinkRightSide>
              <Typography variant='caption'>{moment(post.date).format(DATE_FORMAT)}</Typography>
              <FlexSpacer />
              <PostLinkTags>
                {post.tags && post.tags.map((tag, index) => <Chip key={index} label={tag} />)}
              </PostLinkTags>
            </PostLinkRightSide>
          </PostLink>
        </Link>
      )}
    </Root>
  )
}

PostList.defaultProps = {
  filters: {},
  limit: posts.length
}

PostList.propTypes = {
  limit: PropTypes.number,
  filters: PropTypes.shape({
    tagsInclude: PropTypes.arrayOf(PropTypes.string),
    tagsExclude: PropTypes.arrayOf(PropTypes.string)
  })
}

export default PostList
