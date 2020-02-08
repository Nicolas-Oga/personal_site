import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Panner from '../Panner'
import Context from './Context'

const Item = styled.img`
  display: block;
  border-radius: 10px;
  object-fit: cover;
  height: 100%;

  &:not(:last-child) {
    margin-right: 8px;
  }

  cursor: zoom-in;
`

const LeftArrow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  background-color: tomato;
`

const RightArrow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background-color: white;
`

const CustomPanner = styled(Panner)`
  margin: 16px 0;
  padding: 8px;
  height: 300px;
  background-color: whitesmoke;
`

const Gallery = ({ images }) => {
  const { displayOverlay } = useContext(Context)

  return (
    <CustomPanner>
      {images.map((src, index) => (
        <Item
          src={src}
          key={index}
          onClick={_ => displayOverlay({ images, currentImage: src })}
        />
      ))}
    </CustomPanner>
  )
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Gallery
