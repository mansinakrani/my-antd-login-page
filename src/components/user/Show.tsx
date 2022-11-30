import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../config";
// import { PageLayout } from "../login/PageLayout";
import { UserProfile } from "./Profile";
import { callMsGraph } from "../../graph";
import { Button, Icon } from "@pankod/refine-antd";
// import "./styles/App.css";
import { type } from "os";
import { IResourceComponentsProps } from "@pankod/refine-core";
// import { SignOut } from "./SignOut";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response: { accessToken: string; }) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }

    return (        
            <div>
                <h5>Welcome {accounts[0].name}</h5>
                {graphData ? 
                    <UserProfile graphData={graphData} />
                    :
                    <Button type="primary" onClick={RequestProfileData}>Request Profile Information</Button>
                }
            </div>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {    
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h3 className="card-title">Please sign-in to see your profile information.</h3>
            </UnauthenticatedTemplate>
        </div>
    );
};

export const UserData: React.FC<IResourceComponentsProps> = () => {
    return (
        // <PageLayout>
            <div>
                <MainContent />
                {/* <SignOut/> */}
            </div>
        // </PageLayout>
    );
}

