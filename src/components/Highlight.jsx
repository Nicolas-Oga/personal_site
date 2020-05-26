import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

const Highlight = styled(Typography).attrs({
  variant: 'body1',
  component: 'p',
  paragraph: true
})`
  font-style: italic;
  font-weight: bold !important;
  color: ${props => props.theme.palette.primary['900']} !important;
  background-color: ${props => props.theme.palette.background.default} !important;
  border-radius: 5px;
  padding: ${props => props.theme.spacing(1, 1, 1, 8)} !important;
  line-height: 30px !important;
`

export default Highlight
