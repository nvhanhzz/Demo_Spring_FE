import { Outlet } from "react-router-dom";
import AlertContainer from "../../components/AlertContainer";

function AuthLayout() {
    return (
        <>
            <AlertContainer />
            <Outlet />
        </>
    );
}

export default AuthLayout;