import React from 'react'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import { Link as RouterLink } from 'react-router-dom'

import GitHubIcon from '../assets/github-logo.svg'
import Button from '../components/Button'

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  border-top: 1px solid lightgrey;
  padding: 16px 0;
  margin-top: 24px;


  ${breakpoint('mobile', 'tablet')`
    & > :not(:last-child) {
      margin-bottom: 8px;
    }
  `}

  ${breakpoint('desktop')`
    flex-direction: row;
  `}
`

const FlexSpacer = styled.span`
  flex-grow: 1;
`

const Footer = _props => {
  return (
    <Root>
      <a href='http://creativecommons.org/licenses/by-nc/4.0/' target='_blank' rel='license noopener noreferrer'>
        <img
          alt='Licencia Creative Commons'
          src='https://i.creativecommons.org/l/by-nc/4.0/88x31.png'
        />
      </a>
      <FlexSpacer />
      <Button component={RouterLink} to='/contact'>
        Contact
      </Button>
      <Button
        href={process.env.FRONT_SOURCE_CODE_URL}
        target='_blank'
        rel='noopeener noreferrer'
        endIcon={<GitHubIcon />}
      >
        Check the source code
      </Button>
    </Root>
  )
}

export default Footer
