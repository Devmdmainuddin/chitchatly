import {
    createBrowserRouter,
  } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registation from "../pages/Registation";
import PrivateRoute from "./PrivateRoute";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout></Layout>,children: [
        {
          path: "/",
          element:<PrivateRoute><Home /> </PrivateRoute> ,
        },
        {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/registation",
            element: <Registation />,
          },
      ],
    },
  ]);
  
  export default router;