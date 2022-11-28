import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authProvider";
import { Dropdown, Menu } from "@pankod/refine-antd";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch(e => {
                console.log(e);
            });
        }
    }
    const menu = (
        <Menu>
        <Menu.Item key={1} onClick={() => handleLogin("popup")}>Sign in using Popup</Menu.Item>
        <Menu.Item key={2} onClick={() => handleLogin("redirect")}>Sign in using Redirect</Menu.Item>
    </Menu>
    );
    return (
        <Dropdown.Button type="primary" overlay={menu}>
            <a className="ant-dropdown-link">
            Sign in
            </a> 
        </Dropdown.Button>
    )
}

// import React from "react";
// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../authConfig";
// import Button from "react-bootstrap/Button";


// /**
//  * Renders a button which, when selected, will redirect the page to the login prompt
//  */
// export const SignInButton = () => {
//     const { instance } = useMsal();

//     const handleLogin = (loginType) => {
//         if (loginType === "redirect") {
//             instance.loginRedirect(loginRequest).catch(e => {
//                 console.log(e);
//             });
//         }
//     }
//     return (
//         <Button variant="secondary" className="ml-auto" onClick={() => handleLogin("redirect")}>Sign in using Redirect</Button>
//     );
// }