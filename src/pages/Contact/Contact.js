import React, { useState } from 'react'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'

import Typography from '@material-ui/core/Typography'
import MuiButton from '@material-ui/core/Button'
import EmailIcon from '@material-ui/icons/Email'

import setDocumentTitle from '../../setDocumentTitle'

import ContactForm from './ContactForm'

import GitHubIcon from '../../assets/github-logo.svg'
import LinkedInIcon from './linkedin.svg'
import StackOverflow from './stackoverflow.svg'

const LINK_CONFIG = [
  {
    icon: <EmailIcon />,
    text: 'Email',
    href: 'mailto:2112.oga@gmail.com',
  },
  {
    icon: <GitHubIcon />,
    text: 'GitHub',
    description: 'Check my repositories',
    href: 'https://github.com/nicooga'
  },
  {
    icon: <LinkedInIcon />,
    text: 'LinkedIn',
    description: 'See my profile and experience',
    href: 'https://www.linkedin.com/in/nicolasoga/'
  },
  {
    icon: <StackOverflow />,
    text: 'StackOverflow',
    description: <>Check my questions and answers.<br/>I have over 6k reputation!</>,
    href: 'https://stackoverflow.com/users/1740079/nicooga'
  }
]

const Root = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoint('desktop')`
    flex-direction: row;
    justify-content: space-between;
  `}
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Button = styled(MuiButton)`
  text-transform: none !important;
`

const ContactLinksRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${breakpoint('mobile')`
    display: inline;
    align-items: end;
  `}
`

const ContactLinksTitle = styled(Typography).attrs({ variant: 'body1', paragraph: true })`
  text-align: center !important;

  ${breakpoint('desktop')`
    text-align: left;
  `}
`

const ContactLinkRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

const ContactLinkDescription = styled.div`
  width: 300px;
  height: 30px;
  display: none;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 500ms;
  text-align: center !important;

  ${breakpoint('mobile')`
    display: block;
  `}
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-context: center;
`

const ContactLinks = _props => {
  const [currentDesc, setCurrentDesc] = useState()

  return (
    <ContactLinksRoot>
      {LINK_CONFIG.map(
        ({ icon, href, text, description }, index) => (
          <ContactLinkRoot key={index}>
            <Button
              startIcon={icon}
              onMouseEnter={_ => setCurrentDesc(description)}
              onMouseLeave={_ => setDescVisible(null)}
              href={href}
              target='_blank'
            >
              {text}
            </Button>
          </ContactLinkRoot>
        )
      )}

      <ContactLinkDescription visible={!!currentDesc}>
        <Typography variant='body1' component='span'>
          {currentDesc}
        </Typography>
      </ContactLinkDescription>
    </ContactLinksRoot>
  )
}

const Contact = _props => {
  setDocumentTitle({ subtitle: 'Contact' })

  return (
    <Root>
      <LeftColumn>
        <ContactLinksTitle>
          Find me at these places ...
        </ContactLinksTitle>

        <ContactLinks />
      </LeftColumn>

      <FormSection>
        <Typography variant='body1' paragraph>
          ... or simply use this contact form
        </Typography>

        <ContactForm />
      </FormSection>
    </Root>
  )
}

export default Contact
