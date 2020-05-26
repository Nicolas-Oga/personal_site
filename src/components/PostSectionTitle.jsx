import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import slugify from 'slugify'

const PostSectionTitle = styled(Typography).attrs(({ children }) => ({
  variant: 'h6',
  component: 'h4',
  id: slugify(children).toLowerCase(),
  children
}))`
  border-bottom: 1px solid lightgrey;
  margin: 32px 0 !important;
`

export default PostSectionTitle
