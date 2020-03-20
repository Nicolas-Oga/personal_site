import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint'

import Panner from '../Panner'

const STRIP_HEIGHT = '200px'
const STRIP_PADDING = '8px'
const CYCLE_BUTTON_PADDING = '40px'

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

const CurrentImageWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`

const CurrentImage = styled.img`
  max-height: 100%
`

export {
  Root,
  Strip,
  StripItem,
  CloseButtonWrapper,
  PrevButtonWrapper,
  NextButtonWrapper,
  CurrentImageWrapper,
  CurrentImage
}
