import React, { useContext, useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

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
  body {
    overflow: hidden;
  }
`

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 2;
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

const CurrentImage = styled.img`
  max-width: 100%;
  max-height: calc(100vh - ${STRIP_HEIGHT} - ${STRIP_PADDING} * 2);
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
`

const StripItem = styled.img`
  height: calc(100% - 2px);
  border: 1px solid ${props => props.current ? 'white' : 'transparent'};
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 8px;j
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

const Overlay = ({ images, currentImage: initialCurrentImage }) => {
  const { hideOverlay } = useContext(Context)
  const [currentImage, setCurrentImage] = useState(initialCurrentImage)
  const [prevImage, setPrevImage] = useState()
  const [nextImage, setNextImage] = useState()

  useEffect(_ => {
    const currentImageIndex = images.indexOf(currentImage)
    setPrevImage(images[currentImageIndex - 1])
    setNextImage(images[currentImageIndex + 1])
  }, [currentImage])

  useEffect(_ => {
    const listener = document.body.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') {
        hideOverlay()
      } else if (ev.key === 'ArrowLeft') {
        displayPrevImage()
      } else if (ev.key === 'ArrowRight') {
        displayNextImage()
      }
    })

    return _ => document.body.removeEventListener('keydown', listener)
  }, [prevImage, nextImage])

  const displayPrevImage = _ => prevImage && setCurrentImage(prevImage)
  const displayNextImage = _ => nextImage && setCurrentImage(nextImage)

  return (
    <>
      <GlobalStyle />
      <Root>
        <CurrentImageWrapper>
          {prevImage && (
            <PrevButtonWrapper>
              <IconButton>
                <ArrowBackIosIcon
                  style={{ color: 'white' }}
                  onClick={displayPrevImage}
                />
              </IconButton>
            </PrevButtonWrapper>
          )}

          <CurrentImage src={currentImage} />

          {nextImage && (
            <NextButtonWrapper>
              <IconButton>
                <ArrowForwardIosIcon
                  style={{ color: 'white' }}
                  onClick={displayNextImage}
                />
              </IconButton>
            </NextButtonWrapper>
          )}
        </CurrentImageWrapper>

        <Strip>
          {images.map((image, index) => (
            <StripItem
              src={image}
              key={index}
              onClick={_ => setCurrentImage(image)}
              current={image === currentImage}
            />
          ))}
        </Strip>

        <CloseButtonWrapper>
          <IconButton onClick={hideOverlay}>
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        </CloseButtonWrapper>
      </Root>
    </>
  )
}

export default Overlay
