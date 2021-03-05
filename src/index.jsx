import 'regenerator-runtime/runtime'
import 'normalize.css'
import 'typeface-roboto'
import 'highlight.js/styles/atelier-cave-dark.css'

import React from 'react'
import ReactDOM from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'
import breakpoint from 'styled-components-breakpoint'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom'

import ThemeProvider from './components/ThemeProvider'
import AuthProvider from './components/AuthProvider'
import CommentsApiProvider from './components/CommentsApiProvider'

import Home from './pages/Home'
// import AboutMe from './pages/AboutMe'
import Contact from './pages/Contact'
import PostViewer from './pages/PostViewer'
import NotFound from './pages/NotFound'

import PostList from './components/PostList'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import { GalleryOverlayProvider } from './components/GalleryOverlay'

const Root = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoint('desktop')`
    justify-content: center;
    flex-direction: row;
  `}
`

const MainContainer = styled.div`
  width: 100%;
  max-width: 100%;

  ${breakpoint('desktop')`
    width: 1000px;
    margin-top: 70px;
  `}
`

// 361px here is a magic number which sums all the vertical space taken by navigation, footer and the margin of other elements.
// No one likes magic numbers, but in this case is not a big deal.
const Body = styled.div`
  box-sizing: border-box;
  max-width: 100%;
  padding: 8px;

  ${breakpoint('desktop')`
    padding: 40px 0 0 8px;
    min-height: calc(100vh - 291px);
  `}
`

const App = _props => (
  <CommentsApiProvider>
    <AuthProvider>
      <ThemeProvider>
        <GalleryOverlayProvider>
          <Router>
            <Root>
              <MainContainer>
                <Navigation />

                <Body>
                  <Switch>
                    <Route exact path='/' component={Home} />
                    {/* <Route path='/about-me' component={AboutMe} /> */}
                    <Route path='/contact' component={Contact} />
                    {/* I use withRouter to force a re-render on route change */}
                    <Route path='/about-software' render={withRouter(_ => <PostList filters={{ tagsInclude: ['software'] }}/>)} />
                    <Route path='/about-stuff' render={withRouter(_ => <PostList filters={{ tagsExclude: ['software'] }}/>)} />
                    <Route path='/all-posts' component={withRouter(PostList)} />
                    <Route path='/posts/:slug' component={PostViewer} />
                    <Route path='*' component={NotFound} />
                  </Switch>
                </Body>

                <Footer />
              </MainContainer>
            </Root>
          </Router>
        </GalleryOverlayProvider>
      </ThemeProvider>
    </AuthProvider>
  </CommentsApiProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))
