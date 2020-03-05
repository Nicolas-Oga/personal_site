import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'

import Typography from '@material-ui/core/Typography'

const FigureRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
  padding: 8px;
  background-color: whitesmoke;
`

const FigureImage = styled.img`
  margin-bottom: 16px;
  border: 1px solid lightgrey;
  max-width: 100%;
  height: 100px;

  ${breakpoint('tablet')`
    height: 200px;
  `}

  ${breakpoint('desktop')`
    height: 300px;
  `}
`

const Figure = ({ src, caption }) => (
  <FigureRoot>
    <FigureImage src={src} />
    <Typography variant='caption'>{caption}</Typography>
  </FigureRoot>
)

Figure.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
}

export default Figure
