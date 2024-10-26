import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import KeyValue from "./components/KeyValue";
import GenerateConfig from './components/GenerateConfig';
import UploadConfig from './components/UploadConfig';
import Common from './components/Common';
import Harness from './components/Harness';
import Footer from './components/Footer';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
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
  </React.StrictMode>
);