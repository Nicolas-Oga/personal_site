import React, { useContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import breakpoint from 'styled-components-breakpoint'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import Context from './Context'
import Panner from '../Panner'

const STRIP_HEIGHT = '200px'
const STRIP_PADDING = '8px'
const CYCLE_BUTTON_PADDING = '40px'

const GlobalStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
  }
`

// z-index is set to be greater than MaterialUI AppBar's
const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 1101;
  display: flex;
  flex-direction: column;
`

const CurrentImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

const Strip = styled(Panner).attrs({
  panControlColor: 'rgba(0, 0, 0, 0.95)',
  center: true
})`
  background-color: #0c0b0b;
  height: ${STRIP_HEIGHT};
  padding: ${STRIP_PADDING};
  width: calc(100% - 16px);
  flex-shrink: 0;
  display: none;
  box-sizing: border-box;

  ${breakpoint('desktop')`
    display: block;
  `}
`

const StripItem = styled.img`
  height: calc(100% - 2px);
  border: 1px solid ${props => props.current ? 'white' : 'transparent'};
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 8px;
  }
`

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`

const BaseButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`

const PrevButtonWrapper = styled(BaseButtonWrapper)`
  left: 0;
  height: 100%;
  padding-left: ${CYCLE_BUTTON_PADDING};
`

const NextButtonWrapper = styled(BaseButtonWrapper)`
  right: 0;
  padding-right: ${CYCLE_BUTTON_PADDING};
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

  const CurrentImage = styled.img`
    max-width: 100%;
    max-height: 100%;

    ${breakpoint('desktop')`
      max-height: calc(100vh - ${images.length > 0 ? STRIP_HEIGHT : '0px'} - ${STRIP_PADDING} * 2);
    `}
  `

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
        <CurrentImageWrapper>
          {prevImage && (
            <PrevButtonWrapper>
              <IconButton onClick={displayPrevImage}>
                <ArrowBackIosIcon style={{ color: 'white' }} />
              </IconButton>
            </PrevButtonWrapper>
          )}

          <CurrentImage src={currentImage} />

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
