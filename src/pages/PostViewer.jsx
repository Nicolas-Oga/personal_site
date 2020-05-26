import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import moment from 'moment'
import { Link } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import setDocumentTitle from '../setDocumentTitle'
import posts from '../posts'
import CommentHub from '../components/CommentHub'
import PostSectionTitle from '../components/PostSectionTitle'

import myAvatar from '../assets/me.png'

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

const CustomLink = styled(Link)`
  text-decoration: none !important;
`

const AuthorCard = styled(Paper).attrs({ elevation: 0 })`
  background-color: ${props => props.theme.palette.background.default} !important;
  padding: ${props => props.theme.spacing(2)} !important;
  box-sizing: border-box;
  width: 300px !important;
  max-width: 100% !important;
`

const structuredData = post => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://nicolasoga.com.ar/posts/${post.slug}`
  },
  headline: post.plainTextTitle || post.title,
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
      <div>
        <Typography variant='h4' component='h1'>{post.title}</Typography>
        <Typography variant='subtitle1' component='h2'>{post.description}</Typography>
      </div>

      <FlexSpacer />

      <HeaderRightSide>
        <Typography variant='body1'>{moment(post.date).format(DATE_FORMAT)}</Typography>
      </HeaderRightSide>
    </Header>

    <Component />

    <Grid container justify='flex-end'>
      <Grid item>
        <Typography variant='body1' align='right' paragraph>
          Thanks for reading!
        </Typography>

        <CustomLink to='/contact'>
          <AuthorCard>
            <Typography variant='body1'>
              <Grid container spacing={2} wrap='nowrap'>
                <Grid item>
                  <Avatar src={myAvatar} size='big' />
                </Grid>

                <Grid item>
                  <Grid container direction='column' spacing={1}>
                    <Grid item>Nicolas Oga </Grid>
                    <Grid item><Divider /></Grid>
                    <Grid item>Software engineer, amateur musician, part-time otaku</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Typography>
          </AuthorCard>
        </CustomLink>
      </Grid>
    </Grid>

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
