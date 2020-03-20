import React, { useContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import Context from './Context'

import {
  Root,
  Strip,
  StripItem,
  CloseButtonWrapper,
  PrevButtonWrapper,
  NextButtonWrapper,
  CurrentImageWrapper,
  CurrentImage
} from './styledComponents'

const GlobalStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
  }
`

const GalleryOverlay = ({ images, currentImage: initialCurrentImage }) => {
  const { hideOverlay } = useContext(Context)
  const [currentImage, setCurrentImage] = useState(initialCurrentImage)
  const lastTouch = useRef()

  const currentImageIndex = images.indexOf(currentImage)
  const prevImage = images[currentImageIndex - 1]
  const nextImage = images[currentImageIndex + 1]
  const displayPrevImage = _ => prevImage && setCurrentImage(prevImage)
  const displayNextImage = _ => nextImage && setCurrentImage(nextImage)

  useEffect(_ => {
    const listener = ev => {
      if (ev.key === 'Escape') {
        hideOverlay()
      } else if (ev.key === 'ArrowLeft') {
        displayPrevImage()
      } else if (ev.key === 'ArrowRight') {
        displayNextImage()
      }
    }

    document.body.addEventListener('keydown', listener)
    return _ => document.body.removeEventListener('keydown', listener)
  }, [currentImage])

  const onTouchStart = ev => {
    const { screenX: x, screenY: y } = ev.touches[0]
    lastTouch.current = { x, y }
  }

  const onTouchEnd = ev => {
    const { screenX: x, screenY: y } = ev.changedTouches[0]

    const deltaX = lastTouch.current.x - x
    const deltaY = lastTouch.current.y - y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaX > 0 ? displayNextImage() : displayPrevImage()
    } else if (deltaY > window.innerHeight / 12) {
      hideOverlay()
    }

    lastTouch.current = undefined
  }

  return (
    <>
      <GlobalStyle />
      <Root onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <CurrentImageWrapper style={{ backgroundImage: `url(${currentImage})` }}>
          {prevImage && (
            <PrevButtonWrapper>
              <IconButton onClick={displayPrevImage}>
                <ArrowBackIosIcon style={{ color: 'white' }} />
              </IconButton>
            </PrevButtonWrapper>
          )}

          {nextImage && (
            <NextButtonWrapper>
              <IconButton onClick={displayNextImage}>
                <ArrowForwardIosIcon style={{ color: 'white' }} />
              </IconButton>
            </NextButtonWrapper>
          )}
        </CurrentImageWrapper>

        {images.length > 0 && (
          <Strip>
            {images.map((image, index) => (
              <StripItem
                src={image}
                key={index}
                onClick={_ => setCurrentImage(image)}
                current={image === currentImage}
                ref={node => {
                  if (!node) { return }
                  if (image === currentImage) {
                    node.scrollIntoView()
                  }
                }}
              />
            ))}
          </Strip>
        )}

        <CloseButtonWrapper>
          <IconButton onClick={hideOverlay}>
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        </CloseButtonWrapper>
      </Root>
    </>
  )
}

GalleryOverlay.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  currentImage: PropTypes.string.isRequired
}

GalleryOverlay.defaultProps = {
  images: []
}

export default GalleryOverlay
