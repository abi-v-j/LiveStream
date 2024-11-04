import React from 'react'
import {
    createBrowserRouter,
    Link,
  } from "react-router-dom";
import App from './App';

const Routes = createBrowserRouter([
    {
      path: "/",
      element:<App/>,
    },
    
  ]);

export default Routes