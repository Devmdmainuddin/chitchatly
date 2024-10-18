import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import AuthProvider from './providers/AuthProvider.jsx'
import {

  RouterProvider,
} from "react-router-dom";
import router from './routes/Routes.jsx';





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    {/* <App /> */}
    </AuthProvider>
   
  </StrictMode>,
)
