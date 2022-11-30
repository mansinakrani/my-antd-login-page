import React from "react";
import { AppProps } from "next/app";
import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-nextjs-router";
import dataProvider from "@pankod/refine-simple-rest";
require("antd/dist/antd.less");
// import { PageLayout } from "../src/components/login/PageLayout"
import LoginPage from "../src/components/login";

import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "@components/layout";
// import { authProvider } from "../src/components/authConfig";
import { PostList, PostCreate, PostEdit, PostShow } from "@components/posts";

import {
  EventType,
  PublicClientApplication,
  AccountInfo,
  EventPayload,
  SilentRequest,
} from "@azure/msal-browser";

import { useIsAuthenticated, useMsal, MsalProvider } from "@azure/msal-react";
import axios, { AxiosRequestConfig } from "axios";

// import { authProvide } from "../src/config";
import { UserData } from "@components/user";
const API_URL = "https://api.fake-rest.refine.dev";

import { msalConfig, loginRequest } from "../src/config";
// const API_URL = "https://api.fake-rest.refine.dev";

export const TOKEN_KEY = "refine-auth";

export const axiosInstance = axios.create();
// const { instance, inProgress, accounts } = useMsal();

axiosInstance.interceptors.request.use(
  // Here we can perform any function we'd like on the request
  (request: AxiosRequestConfig) => {
      // Retrieve the token from local storage
      const token = localStorage.getItem(TOKEN_KEY);

      // Check if the header property exists
      if (request.headers) {
          // Set the Authorization header if it exists
          request.headers["Authorization"] = `Bearer ${token}`;
      } else {
          // Create the headers property if it does not exist
          request.headers = {
              Authorization: `Bearer ${token}`,
          };
      }
      return request;
  },
);

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback(async (event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
      const payload: EventPayload = event.payload;
      msalInstance.setActiveAccount(payload as AccountInfo);

      let account = msalInstance.getActiveAccount();

      const request: SilentRequest = {
          ...loginRequest,
          account: account!,
      };
      try {
          // Silently acquires an access token which is then attached to a request for API access
          const response = await msalInstance.acquireTokenSilent(request);
          console.log("Fetching access token: success");
          console.log("Scopes", response.scopes);
          console.log("Token Type", response.tokenType);

          localStorage.setItem(TOKEN_KEY, response.accessToken);
      } catch (e) {
          msalInstance.acquireTokenPopup(request).then((response) => {
              localStorage.setItem(TOKEN_KEY, response.accessToken);
          });
      }
  }
});

// const App: React.FC = () => 
// function AppData ({ Component, pageProps }: AppProps): JSX.Element {
function MyApp({ Component, pageProps }: AppProps): JSX.Element {

  
  const { inProgress, accounts } = useMsal();

  if (inProgress === "login" || inProgress === "handleRedirect") {
      return <div>Loading...</div>;
  }
  
  const account: AccountInfo = accounts[0];
  // const account: AccountInfo = instance.getAllAccounts();
  
  const request: SilentRequest = {
      ...loginRequest,
      account,
  };
  
  const authProvider: AuthProvider =  {
      login: async () => {
        msalInstance.loginRedirect(loginRequest); // Pick the strategy you prefer i.e. redirect or popup
        console.log("object :",loginRequest);
          return Promise.resolve(false);
      },
      register: async () => Promise.resolve(),
      // resetPassword: async () => Promise.resolve(),
      updatePassword: async () => Promise.resolve(),
      logout: async () => Promise.resolve(),
      checkAuth: async () => {
          try {
              if (account) {
                  const token = await msalInstance.acquireTokenSilent(request);
                  localStorage.setItem(TOKEN_KEY, token.accessToken);
                  return Promise.resolve();
              } else {
                  return Promise.reject();
              }
          } catch (e) {
              return Promise.reject();
          }
      },
      checkError: async () => Promise.resolve(),
      getPermissions: async () => Promise.resolve(),
      getUserIdentity: async (): Promise<AccountInfo> => {
          if (account === null || account === undefined) {
              return Promise.reject();
          }
          return Promise.resolve(account);
      },
  };
  return (
        <MsalProvider instance={msalInstance}>
          <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider(API_URL, axiosInstance)}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
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
              name: "posts",
              list: PostList,
              create: PostCreate,
              edit: PostEdit,
              show: PostShow,
            },
            {
              name: "user",
              show: UserData,
            },
          ]}
        >
          {/* <MsalProvider instance={msalInstance}> */}
            <Component {...pageProps} />
          {/* </MsalProvider> */}
        </Refine>
    // </MsalProvider>
  );
};

export default MyApp;

// function MyApp() {
//   return (
//       <MsalProvider instance={msalInstance}>
//           <AppData/>
//           {/* <Component {...pageProps} /> */}
//       </ MsalProvider>
//   )
//   }


// const API_URL = "https://api.fake-rest.refine.dev";

// const { instance, inProgress, accounts } = useMsal();

// if (inProgress === "login" || inProgress === "handleRedirect") {
//   <div>Loading...</div>;
// }

// const account: AccountInfo = accounts[0];

// const request: SilentRequest = {
//  ...loginRequest,
//  account,
// };

// export const authProvider: AuthProvider = {
//   login: () => {
//       instance.loginRedirect(); // Pick the strategy you prefer i.e. redirect or popup
//       return Promise.resolve(false);
//   },
//   register: async () => Promise.resolve(),
//   // resetPassword: async () => Promise.resolve(),
//   updatePassword: async () => Promise.resolve(),
//   logout: async () => Promise.resolve(),
//   checkAuth: async () => {
//       try {
//           if (account) {
//               const token = await instance.acquireTokenSilent(request);
//               localStorage.setItem(TOKEN_KEY, token.accessToken);
//               return Promise.resolve();
//           } else {
//               return Promise.reject();
//           }
//       } catch (e) {
//           return Promise.reject();
//       }
//   },
//   checkError: async () => Promise.resolve(),
//   getPermissions: async () => Promise.resolve(),
//   getUserIdentity: async (): Promise<AccountInfo> => {
//       if (account === null || account === undefined) {
//           return Promise.reject();
//       }
//       return Promise.resolve(account);
//   },
  
// };

// -----------------------------------------------

// function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  
    // const isAuthenticated = useIsAuthenticated();
    
 
    // if (inProgress === "login" || inProgress === "handleRedirect") {
    //      <div>Loading...</div>;
    // }
  
    // const account: AccountInfo = accounts[0];
  
    // const request: SilentRequest = {
    //     ...loginRequest,
    //     account,
    // };
  
    // const authProvider: AuthProvider = {
    //     login: () => {
    //         instance.loginRedirect(); // Pick the strategy you prefer i.e. redirect or popup
    //         return Promise.resolve(false);
    //     },
    //     register: async () => Promise.resolve(),
    //     // resetPassword: async () => Promise.resolve(),
    //     updatePassword: async () => Promise.resolve(),
    //     logout: async () => Promise.resolve(),
    //     checkAuth: async () => {
    //         try {
    //             if (account) {
    //                 const token = await instance.acquireTokenSilent(request);
    //                 localStorage.setItem(TOKEN_KEY, token.accessToken);
    //                 return Promise.resolve();
    //             } else {
    //                 return Promise.reject();
    //             }
    //         } catch (e) {
    //             return Promise.reject();
    //         }
    //     },
    //     checkError: async () => Promise.resolve(),
    //     getPermissions: async () => Promise.resolve(),
    //     getUserIdentity: async (): Promise<AccountInfo> => {
    //         if (account === null || account === undefined) {
    //             return Promise.reject();
    //         }
    //         return Promise.resolve(account);
    //     },
        
    // };
 
   //  return authProvider;
 
//   return (
//     <>
//     <MsalProvider instance={msalInstance}>
//       <Refine
//       routerProvider={routerProvider}
//       dataProvider={dataProvider(API_URL, axiosInstance)}
//       notificationProvider={notificationProvider}
//       ReadyPage={ReadyPage}
//       catchAll={<ErrorComponent />}
//       Title={Title}
//       Header={Header}
//       Sider={Sider}
//       Footer={Footer}
//       Layout={Layout}
//       OffLayoutArea={OffLayoutArea}
//       authProvider={authProvider}
//       LoginPage={LoginPage}
//       resources={[
//         {
//           name: "posts",
//           list: PostList,
//           create: PostCreate,
//           edit: PostEdit,
//           show: PostShow,
//         },
//         {
//           name: "user",
//           show: UserData,
//         },
//       ]}
//     >
//       {/* <MsalProvider instance={msalInstance}> */}
//         <Component {...pageProps} />
//       {/* </MsalProvider> */}
//     </Refine>
//     </MsalProvider>
//     </>
//   );
// }

// export default MyApp;
