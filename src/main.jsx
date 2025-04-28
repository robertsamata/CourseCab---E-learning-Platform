import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Home from './pages/Home';
import Administrate from './pages/Administrate';
import Courses from './pages/Courses';
import History from './pages/History';
import Evaluate from './pages/Evaluate';
import Course from './pages/Course';


const router = createBrowserRouter([
  {path: "/", element: <Home />},
  {path: "/history", element: <History />},
  {path: "/courses", element: <Courses />},
  {path: "/admin", element: <Administrate />},
  {path: "/evaluate/:id", element: <Evaluate />},
  {path: "/course/:id", element: <Course />}
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
