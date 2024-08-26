import './assets/css/styles.css';
import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import KeyValue from "./components/KeyValue";
import GenerateConfig from './components/GenerateConfig';
import UploadConfig from './components/UploadConfig';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/config-ui",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <div className='welcome'>
          <h3>Welcome to Config Management!!!</h3>
          <p>Simplify Complexity with Expert Configuration Management</p>
        </div>
      </>
    ),
  },
  {
    path: "/keyvalue",
    element: (
      <>
        <Header/>
        <Sidebar onRetrieve={() => {}} />
        <KeyValue />
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
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);