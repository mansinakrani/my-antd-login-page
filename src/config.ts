/* eslint-disable default-case */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { Configuration, LogLevel } from "@azure/msal-browser";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig: Configuration = {
    auth: {
        clientId: `${process.env.NEXT_PUBLIC_APP_AZURE_AAD_CLIENT_ID}`,
        authority: "https://login.microsoftonline.com/common/",
        redirectUri: "http://localhost:3000/posts",
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    // system: {	
    //     loggerOptions: {	
    //         loggerCallback: (level: any, message: any, containsPii: any) => {	
    //             if (containsPii) {		
    //                 return;		
    //             }		
    //             switch (level) {		
    //                 case LogLevel.Error:		
    //                     console.error(message);		
    //                     return;		
    //                 case LogLevel.Info:		
    //                     console.info(message);		
    //                     return;		
    //                 case LogLevel.Verbose:		
    //                     console.debug(message);		
    //                     return;		
    //                 case LogLevel.Warning:		
    //                     console.warn(message);		
    //                     return;		
    //             }	
    //         }	
    //     }	
    // }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */

//  export const tokenRequest = {
//     scopes: ["Mail.Read"] // Replace ... with your custom scopes
// };

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

export const msalInstance = new PublicClientApplication(msalConfig);
// 
// import { AuthProvider } from "@pankod/refine-core";
// import nookies from "nookies";

// const mockUsers = [
//   {
//     username: "admin",
//     email: "admin@refine.dev",
//     roles: ["admin"],
//   },
//   {
//     username: "editor",
//     email: "editor@refine.dev",
//     roles: ["editor"],
//   },
// ];

// export const authProvider: AuthProvider = {
//   login: ({ email, username, password, remember }) => {
//     // Suppose we actually send a request to the back end here.
//     const user = mockUsers[0];

//     if (user) {
//       nookies.set(null, "auth", JSON.stringify(user), {
//         maxAge: 30 * 24 * 60 * 60,
//         path: "/",
//       });
//       return Promise.resolve();
//     }

//     return Promise.reject();
//   },
//   logout: () => {
//     nookies.destroy(null, "auth");
//     return Promise.resolve();
//   },
//   checkError: (error) => {
//     if (error && error.statusCode === 401) {
//       return Promise.reject();
//     }

//     return Promise.resolve();
//   },
//   checkAuth: (ctx) => {
//     const cookies = nookies.get(ctx);
//     return cookies["auth"] ? Promise.resolve() : Promise.reject();
//   },
//   getPermissions: () => {
//     const auth = nookies.get()["auth"];
//     if (auth) {
//       const parsedUser = JSON.parse(auth);
//       return Promise.resolve(parsedUser.roles);
//     }
//     return Promise.reject();
//   },
//   getUserIdentity: () => {
//     const auth = nookies.get()["auth"];
//     if (auth) {
//       const parsedUser = JSON.parse(auth);
//       return Promise.resolve(parsedUser.username);
//     }
//     return Promise.reject();
//   },
// };
