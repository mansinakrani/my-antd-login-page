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
import { API_URL } from '../src/constants'
import { UserData } from '../src/components/user'
import axios,{ AxiosRequestConfig } from "axios";
import { authProvider } from 'src/authProvider'

export const TOKEN_KEY = 'refine-auth'
export const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  // Here we can perform any function we'd like on the request
  (request: AxiosRequestConfig) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem(TOKEN_KEY)

    // Check if the header property exists
    if (request.headers) {
      // Set the Authorization header if it exists
      request.headers['Authorization'] = `Bearer ${token}`
    } else {
      // Create the headers property if it does not exist
      request.headers = {
        Authorization: `Bearer ${token}`,
      }
    }
    return request
  },
)
// const isAuthenticated = useIsAuthenticated()
//   const { instance, inProgress, accounts } = useMsal();

//   // if (inProgress === "login" || inProgress === "handleRedirect") {
//   //     return <div>Loading...</div>;
//   // }

//   const account: AccountInfo = accounts[0];
//   const request: SilentRequest = {
//     ...loginRequest,
//     account,
//   }

// export const authProvider: AuthProvider = {
//   login: async () => {
//     instance.loginRedirect(loginRequest) // Pick the strategy you prefer i.e. redirect or popup
//     console.log('object :', loginRequest)
//     return Promise.resolve("/user")
//   },
//   register: async () => Promise.resolve(),
//   // resetPassword: async () => Promise.resolve(),
//   updatePassword: async () => Promise.resolve(),
//   logout: async () => Promise.resolve(),
//   checkAuth: async () => {
//     try {
//       if (account) {
//         const token = await instance.acquireTokenSilent(request)
//         localStorage.setItem(TOKEN_KEY, token.accessToken)
//         return Promise.resolve()
//       } else {
//         return Promise.reject()
//       }
//     } catch (e) {
//       return Promise.reject()
//     }
//   },
//   checkError: async () => Promise.resolve(),
//   getPermissions: async () => Promise.resolve(),
//   getUserIdentity: async (): Promise<AccountInfo> => {
//     if (account === null || account === undefined) {
//       return Promise.reject()
//     }
//     return Promise.resolve(account)
//   },
// }



const App: React.FC = () =>  {
 

  return (
      <Refine
        routerProvider={routerProvider}
        dataProvider={dataProvider(API_URL, axiosInstance)}
        notificationProvider={notificationProvider}
        Title={Title}
        Header={Header}
        Sider={Sider}
        Footer={Footer}
        Layout={Layout}
        OffLayoutArea={OffLayoutArea}
        authProvider={authProvider}
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
      </Refine>
  )
}

export default App;
