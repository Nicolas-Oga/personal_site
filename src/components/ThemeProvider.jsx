import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import orange from '@material-ui/core/colors/orange'
import yellow from '@material-ui/core/colors/yellow'

const ThemeProvider = ({ children }) => {
  const theme = createMuiTheme({
    palette: {
      primary: orange,
      secondary: yellow
    }
  })

  useEffect(_ => {
    window.theme = theme
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        {children}
      </SCThemeProvider>
    </MuiThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired
}

export default ThemeProvider
