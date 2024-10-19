import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import useAuth from "../hooks/useAuth";
// import Home from "../pages/Home";
// import Login from "../pages/Login";


const Layout = () => {
    // const {user,loading}=useAuth()
    // if(loading){
    //     <p>loading..............</p>
    // }
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* {user?<Home />:<Login /> } */}
        </div>
    );
};

export default Layout;