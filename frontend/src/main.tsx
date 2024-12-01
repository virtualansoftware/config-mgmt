import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import React from "react";
import ReactDOM from "react-dom/client";
import Login from './pages/Login';
import Register from './pages/Register';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import KeyValue from "./pages/KeyValue";
import GenerateConfig from './pages/GenerateConfig';
import UploadConfig from './pages/UploadConfig';
import Common from './pages/Common';
import Harness from './pages/Harness';
import Footer from './components/Footer';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const clientId = "YOUR_GOOGLE_CLIENT_ID";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <>
        <Header/>
        <Login/>
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Header/>
        <Register/>
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <Profile/>
        <Footer/>
      </>
    ),
  },
  {
    path: "/settings",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <Settings/>
        <Footer/>
      </>
    ),
  },
  {
    path: "/config-mgmt",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <div className='welcome'>
          <h3>Welcome to Config Management!!!</h3>
          <p>Simplify Complexity with Expert Configuration Management</p>
        </div>
        <Footer/>
      </>
    ),
  },
  {
    path: "/config",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <KeyValue />
        <Footer/>
      </>
    ),
  },
  {
    path: "/generate-config",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <GenerateConfig />
        <Footer/>
      </>
    ),
  },
  {
    path: "/upload-template",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <UploadConfig />
        <Footer/>
      </>
    ),
  },
  {
    path: "/common-config",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <Common />
        <Footer/>
      </>
    ),
  },
  {
    path: "/harness",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <Harness />
        <Footer/>
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
      <ToastContainer 
        className="toaster" 
        theme="dark" 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </GoogleOAuthProvider>
  </React.StrictMode>
);