import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { AntdLayout } from "@pankod/refine-antd";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props: { children: any; }) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <AntdLayout.Header>
                <a className="navbar-brand" href="/">MSAL React Tutorial</a>
                { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
            </AntdLayout.Header>
            <h5>Welcome to the Microsoft Authentication Library For React Tutorial</h5>
            <br />
            <br />
            {props.children}
        </>
    );
};