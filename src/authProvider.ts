// import { useMsal } from "@azure/msal-react"
// import { AuthProvider } from "@pankod/refine-core"
import { TOKEN_KEY } from "pages/_app"
import { loginRequest, msalConfig } from "./config";
import axios,{ AxiosRequestConfig } from "axios";
import {
  EventType,
  PublicClientApplication,
  AccountInfo,
  EventPayload,
  SilentRequest,
} from '@azure/msal-browser'

// const { accounts } = useMsal()

// if (inProgress === 'login' || inProgress === 'handleRedirect') {
//   return <div>Loading...</div>
// }
// const { accounts } = useMsal()
// const account: AccountInfo = accounts[0]

// const account: AccountInfo = instance.getAllAccounts();

// const request: SilentRequest = {
//   ...loginRequest,
//   account,
// }
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

export const msalInstance = new PublicClientApplication(msalConfig)

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

// const { accounts } = useMsal();

  // if (inProgress === "login" || inProgress === "handleRedirect") {
  //     return <div>Loading...</div>;
  // }

  // export const account: AccountInfo = accounts[0];
  // export const request: SilentRequest = {
  //   ...loginRequest,
  //   account,
  // }



// export const authProvider: AuthProvider = {
//   login: async () => {
//     msalInstance.loginRedirect(loginRequest) // Pick the strategy you prefer i.e. redirect or popup
//     console.log('object :', loginRequest)
//     return Promise.resolve(false)
//   },
//   register: async () => Promise.resolve(),
//   // resetPassword: async () => Promise.resolve(),
//   updatePassword: async () => Promise.resolve(),
//   logout: async () => Promise.resolve(),
//   checkAuth: async () => {
//     try {
//       if (account) {
//         const token = await msalInstance.acquireTokenSilent(request)
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