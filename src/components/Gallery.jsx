import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'

import Panner from './Panner'
import { useGalleryOverlay } from './GalleryOverlay'

const CustomPanner = styled(Panner)`
  margin: 16px 0;
  padding: 8px;
  box-sizing: border-box;
  background: linear-gradient(to right, transparent, whitesmoke);
  height: 100px;

  ${breakpoint('tablet')`
    height: 150px;
  `}

  ${breakpoint('desktop')`
    height: 200px;
  `}
`

const Item = styled.img.attrs({ onDragStart: ev => ev.preventDefault() })`
  display: block;
  border-radius: 10px;
  object-fit: cover;
  height: 100%;

  &:not(:last-child) {
    margin-right: 8px;
  }

  cursor: pointer;
`

const Gallery = ({ images }) => {
  const { displayOverlay } = useGalleryOverlay()

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
