import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import AuthProvider from './providers/AuthProvider.jsx'
import {

  RouterProvider,
} from "react-router-dom";
import router from './routes/Routes.jsx';
import { Provider } from 'react-redux';
import store from './Featured/store/store.js';





createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
     <AuthProvider>
    <RouterProvider router={router} />
    {/* <App /> */}
    </AuthProvider>
     </Provider>
 
   
  </StrictMode>,
)
