import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import hljs from 'highlight.js'
import dedent from 'dedent-js'
import javascript from 'highlight.js/lib/languages/javascript'
import Paper from '@material-ui/core/Paper'

hljs.registerLanguage('javascript', javascript)

const Root = styled(Paper)`
  background-color: ${props => props.theme.palette.background.default} !important;
  padding: ${props => props.theme.spacing(1)} !important;
`

const CodeSample = ({ children }) => {
  const html = hljs.highlight('javascript', dedent(children)).value

  console.log(html)
  window.string = children

  return (
    <Root
      component='pre'
      elevation={0}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

CodeSample.propTypes = {
  children: PropTypes.string.isRequired
}

export default CodeSample
