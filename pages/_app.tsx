import React from 'react'
import { AppProps } from 'next/app'
require('antd/dist/antd.less')

import {
  EventType,
  PublicClientApplication,
  AccountInfo,
  EventPayload,
  SilentRequest,
} from '@azure/msal-browser'

import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react'
// import axios, { AxiosRequestConfig } from 'axios'
import { msalConfig, loginRequest, msalInstance } from '../src/config'
import App, { TOKEN_KEY } from './App'


// const msalInstance = new PublicClientApplication(msalConfig)

msalInstance.addEventCallback(async (event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    const payload: EventPayload = event.payload
    msalInstance.setActiveAccount(payload as AccountInfo)

    let account = msalInstance.getActiveAccount()

    const request: SilentRequest = {
      ...loginRequest,
      account: account!,
    }
    try {
      // Silently acquires an access token which is then attached to a request for API access
      const response = await msalInstance.acquireTokenSilent(request)
      console.log('Fetching access token: success')
      console.log('Scopes', response.scopes)
      console.log('Token Type', response.tokenType)

      localStorage.setItem(TOKEN_KEY, response.accessToken)
    } catch (e) {
      msalInstance.acquireTokenPopup(request).then((response) => {
        localStorage.setItem(TOKEN_KEY, response.accessToken)
      })
    }
  }
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {

  return (
    <MsalProvider instance={msalInstance}>
      <App />
      <Component {...pageProps} />
    </MsalProvider>
  )
}

export default MyApp
