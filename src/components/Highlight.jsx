import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'

const Root = styled.div`
  display: block;
  position: relative;
`

const IconWrapper = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing(0)};
  left: ${props => props.theme.spacing(0)};
  z-index: 1;
`

const Text = styled(Typography).attrs({
  variant: 'body1',
  component: 'p',
  paragraph: true
})`
  z-index: 2;
  font-style: italic;
  font-weight: bold !important;
  color: ${props => props.theme.palette.primary['900']} !important;
  background-color: ${props => props.theme.palette.background.default} !important;
  border-radius: 5px;
  padding: ${props => props.theme.spacing(2)} !important;
  padding-left: 80px !important;
  line-height: 30px !important;
`

const Highlight = ({ children }) => {
  return (
    <Root>
      <IconWrapper>
      </IconWrapper>

      <Text>
        <SvgIcon
          component={FormatQuoteIcon}
          style={{ fontSize: '40' }}
        />

        {children}
      </Text>
    </Root>
  )
}

export default Highlight
