import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider, Refine } from '@pankod/refine-core'
import { notificationProvider, ErrorComponent } from '@pankod/refine-antd'
import routerProvider from '@pankod/refine-nextjs-router'
import dataProvider from '@pankod/refine-simple-rest'
require('antd/dist/antd.less')
import LoginPage from './login'

import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from '@components/layout'
import { PostList, PostCreate, PostEdit, PostShow } from '@components/posts'

import {
  EventType,
  PublicClientApplication,
  AccountInfo,
  EventPayload,
  SilentRequest,
} from '@azure/msal-browser'

import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react'
// import axios, { AxiosRequestConfig } from 'axios'
import { msalConfig, loginRequest } from '../src/config'
import { axiosInstance, msalInstance } from 'src/authProvider'
import { API_URL } from '../src/constants'
import { UserData } from '../src/components/user'
// export var { accounts } = useMsal()
// export var account: AccountInfo = accounts[0]
export const TOKEN_KEY = 'refine-auth'

// if (inProgress === "login" || inProgress === "handleRedirect") {
//     return <div>Loading...</div>;
// }

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const isAuthenticated = useIsAuthenticated()
  const { accounts } = useMsal()
  const account: AccountInfo = accounts[0]
  const request: SilentRequest = {
    ...loginRequest,
    account,
  }

  const authProvider: AuthProvider = {
    login: async () => {
      msalInstance.loginRedirect(loginRequest) // Pick the strategy you prefer i.e. redirect or popup
      console.log('object :', loginRequest)
      return Promise.resolve(false)
    },
    register: async () => Promise.resolve(),
    // resetPassword: async () => Promise.resolve(),
    updatePassword: async () => Promise.resolve(),
    logout: async () => Promise.resolve(),
    checkAuth: async () => {
      try {
        if (account) {
          const token = await msalInstance.acquireTokenSilent(request)
          localStorage.setItem(TOKEN_KEY, token.accessToken)
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      } catch (e) {
        return Promise.reject()
      }
    },
    checkError: async () => Promise.resolve(),
    getPermissions: async () => Promise.resolve(),
    getUserIdentity: async (): Promise<AccountInfo> => {
      if (account === null || account === undefined) {
        return Promise.reject()
      }
      return Promise.resolve(account)
    },
  }

  return (
    <MsalProvider instance={msalInstance}>
      <Refine
        routerProvider={routerProvider}
        // routerProvider={{
        //   ...routerProvider,
        //   routes: [
        //     {
        //       path: "/authenticated-page",
        //       element: <AuthenticatedUser />,
        //       Layout: true,
        //     }
        //   ]
        //  }}
        dataProvider={dataProvider(API_URL, axiosInstance)}
        notificationProvider={notificationProvider}
        Title={Title}
        Header={Header}
        Sider={Sider}
        Footer={Footer}
        Layout={Layout}
        OffLayoutArea={OffLayoutArea}
        authProvider={authProvider}
        // DashboardPage={DashboardPage}
        LoginPage={LoginPage}
        resources={[
          {
            name: 'user',
            list: UserData,
          },
          {
            name: 'posts',
            list: PostList,
            create: PostCreate,
            edit: PostEdit,
            show: PostShow,
          },
        ]}
        catchAll={<ErrorComponent />}
      >
        {/* <MsalProvider instance={msalInstance}> */}
        <Component {...pageProps} />
        {/* </MsalProvider> */}
      </Refine>
      //{' '}
    </MsalProvider>
  )
}

export default MyApp
