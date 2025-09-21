import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './Components/Layout'
import Home from './Pages/Home'
import ErrorPage from './Pages/ErrorPage'
import RegisteredEvents from './Pages/RegisteredEvents'
import EventDetailPage from './Pages/EventDetailPage'
import MyEvents from './Pages/MyEvents'
import SignupPage from './Pages/SignupPage'
import SigninPage from './Pages/SigninPage'

const router = createBrowserRouter([
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/', element: <Home /> },
      {path:'/myEvents', element: <MyEvents /> },
      {path:'/registered', element: <RegisteredEvents /> },
      {path:'/event/:id', element: <EventDetailPage /> },
    ]
  },
  { path:'/signin', element:<SigninPage /> },
  { path:'/signup', element:<SignupPage /> },
  {
    path:'*',
    element:<ErrorPage />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App