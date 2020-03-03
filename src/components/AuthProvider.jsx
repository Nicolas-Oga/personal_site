/* global gapi */
import React, { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ls from 'local-storage'

import loadScript from '../loadScript'

const LOGIN_INTO_COMMENTS_API_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        avatarUrl
      }
      token
    }
  }
`

const Context = createContext()

const initGapiClient = async _ => {
  await loadScript('https://apis.google.com/js/platform.js')

  return gapi.load('client:auth2', _ =>
    gapi.client.init({
      apiKey: process.env.GOOGLE_API_KEY,
      clientId: process.env.GOOGLE_OAUTH_KEY,
      scope: 'https://www.googleapis.com/auth/userinfo.profile'
    })
  )
}

const getGoogleOauthData = async _ => {
  const result = await gapi.auth2.getAuthInstance().signIn()
  const { uc: { access_token: accessToken, id_token: idToken } } = result
  return { accessToken, idToken }
}

const setToken = token => ls.set('token', token)

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(ls.get('currentUser'))
  const [loginIntoCommentsApi] = useMutation(LOGIN_INTO_COMMENTS_API_MUTATION)

  useEffect(_ => { initGapiClient() })
  useEffect(_ => { ls.set('currentUser', currentUser) }, [currentUser])

  const logIn = async _ => {
    const googleOauthData = await getGoogleOauthData()
    const { data: { login: { user, token }}} =
      await loginIntoCommentsApi({ variables: { input: { google: googleOauthData }}})

    setCurrentUser(user)
    setToken(token)
  }

  const logOut = _ => {
    setCurrentUser(null)
    setToken(null)
  }

  return (
    <Context.Provider value={{ logIn, logOut, currentUser }}>
      {children}
    </Context.Provider>
  )
}

const useAuth = _ => useContext(Context)

export { useAuth }
export default AuthProvider
