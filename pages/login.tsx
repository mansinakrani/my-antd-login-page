import React from "react";
import { useLogin } from "@pankod/refine-core";
import { AntdLayout, Button } from "@pankod/refine-antd";

// type LoginVariables = {
//     username: string;
//     email: string;
// };
export const LoginPage = () => {
    const { mutate: login } = useLogin();
    const SignInButton = () => {
        

        // function onSubmit(values: LoginVariables) {
        //     login(values);
        // } 
        // onSubmit = (values: LoginVariables) => {
        //     login(values);
        // };
        // console.log(values);
        return (
            <Button
                type="primary"
                size="large"
                block
                onClick={(values) => {
                    login(values);
                }}
            >
                Sign in
            </Button>
        );
    };

    return (
        <AntdLayout
            style={{
                background: `radial-gradient(50% 50% at 50% 50%, #63386A 0%, #310438 100%)`,
                backgroundSize: "cover",
            }}
        >
            <div style={{ height: "100vh", display: "flex" }}>
                <div style={{ maxWidth: "200px", margin: "auto" }}>
                    <div style={{ marginBottom: "28px" }}>
                        <img src="./refine.svg" alt="Refine" />
                    </div>
                    <SignInButton />
                </div>
            </div>
        </AntdLayout>
    );

};

export default LoginPage;