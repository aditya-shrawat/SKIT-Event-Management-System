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
import PopularEventsPage from './Pages/PopularEventsPage'
import CreateEventPage from './Pages/CreateEventPage'
import EventRequests from './Pages/EventRequests'

const router = createBrowserRouter([
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/', element: <Home /> },
      {path:'/myEvents', element: <MyEvents /> },
      {path:'/popular', element: <PopularEventsPage /> },
      {path:'/registered', element: <RegisteredEvents /> },
      {path:'/requests', element: <EventRequests /> },
      {path:'/event/:id', element: <EventDetailPage /> },
      // {path:'/create-event', element: <CreateEventPage /> },
    ]
  },
  {path:'/create-event', element: <CreateEventPage /> },
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