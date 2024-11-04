import React from 'react'
import {
    createBrowserRouter,
    Link,
  } from "react-router-dom";
import App from './App';
import LiveStreamViewer from './user/LiveStreamViewer';

const Routes = createBrowserRouter([
    {
      path: "/",
      element:<App/>,
    },
    {
      path: "/LiveStream",
      element:<LiveStreamViewer/>,
    },
  ]);

export default Routes