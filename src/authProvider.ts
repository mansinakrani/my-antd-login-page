import { AccountInfo, SilentRequest } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { AuthProvider } from "@pankod/refine-core";
import { request } from "http";
import { TOKEN_KEY } from "pages/App";
import { loginRequest, msalInstance } from "./config";

// const isAuthenticated = useIsAuthenticated()
// const { instance, accounts } = useMsal();

// export const account: AccountInfo = accounts[0];
// export const request: SilentRequest = {
//   ...loginRequest,
//   account,
// }
const accounts: AccountInfo[] = msalInstance.getAllAccounts();

export const authProvider: AuthProvider = {
  login: async () => {
    // msalInstance.loginRedirect() // Pick the strategy you prefer i.e. redirect or popup
    console.log('inside login')
    await msalInstance.handleRedirectPromise();
if (accounts.length === 0) {
    // No user signed in
    msalInstance.loginRedirect();
}
    return Promise.resolve("/user")
  },
  register: async () => Promise.resolve(),
  // resetPassword: async () => Promise.resolve(),
  updatePassword: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  checkAuth: async () => {
    try {
      if (accounts) {
        const token = await msalInstance.acquireTokenSilent({
            scopes: ["User.Read"],
            redirectUri: "http://localhost:3000/user"
        });
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
//   getUserIdentity: async (): Promise<AccountInfo> => {
//     if (accounts === null || accounts === undefined) {
//       return Promise.reject()
//     }
//     // return Promise.resolve(accounts)
//     return Promise.resolve(false)
//   },
}