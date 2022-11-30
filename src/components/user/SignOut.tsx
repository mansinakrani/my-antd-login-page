import React from "react";
import { useMsal } from "@azure/msal-react";
import { Dropdown, Menu } from "@pankod/refine-antd";

/**
 * Renders a sign-out button
 */
export const SignOut = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType: string) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }
    return (
        <Dropdown.Button type="primary" overlay={(
            <Menu>
                <Menu.Item onClick={() => handleLogout("popup")}>Sign out using Popup</Menu.Item>
                <Menu.Item onClick={() => handleLogout("redirect")}>Sign out using Redirect</Menu.Item>
            </Menu>
            )}>
            <a className="ant-dropdown-link" 
            onClick={e => e.preventDefault()}>
            Sign Out
            </a> 
        </Dropdown.Button>
    )
}

// import React from "react";
// import { useMsal } from "@azure/msal-react";
// import Button from "react-bootstrap/Button";

// /**
//  * Renders a button which, when selected, will redirect the page to the logout prompt
//  */
// export const SignOutButton = () => {
//     const { instance } = useMsal();
    
//     const handleLogout = (logoutType) => {
//         if (logoutType === "redirect") {
//            instance.logoutRedirect({
//                 postLogoutRedirectUri: "/",
//             });
//         }
//     }

//     return (
//         <Button variant="secondary" className="ml-auto" onClick={() => handleLogout("redirect")}>Sign out using Redirect</Button>
//     );
// }