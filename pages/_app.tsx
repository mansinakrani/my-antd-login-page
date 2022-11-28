import React from "react";
import { AppProps } from "next/app";
import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-nextjs-router";
import dataProvider from "@pankod/refine-simple-rest";
require("antd/dist/antd.less");
// import { PageLayout } from "../src/components/login/PageLayout"
import { loginComponent } from "@components/login/index";

import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "@components/layout";
// import { authProvider } from "src/authProvider";
import { PostList, PostCreate, PostEdit, PostShow } from "@components/posts";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { authProvide } from "../src/authProvider";
const msalInstance = new PublicClientApplication(authProvide);

const API_URL = "https://api.fake-rest.refine.dev";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
    <MsalProvider instance={msalInstance}>
      <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(API_URL)}
      notificationProvider={notificationProvider}
      ReadyPage={ReadyPage}
      catchAll={<ErrorComponent />}
      Title={Title}
      Header={Header}
      Sider={Sider}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      LoginPage={loginComponent}
      resources={[
        {
          name: "/",
          list: PostList,
          create: PostCreate,
          edit: PostEdit,
          show: PostShow,
        },
      ]}
    >
      <Component {...pageProps} />
    </Refine>
    </MsalProvider>
    </>
  );
}

export default MyApp;
