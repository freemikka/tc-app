// Layout.tsx
import { Outlet } from "react-router-dom";
import ShadNav from "./Navbar";

const Layout = () => {
    return (
        <>
            <ShadNav />
            <Outlet />
        </>
    );
};

export default Layout;
