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
import CreateEventPage from './Pages/CreateEventPage'
import EventRequests from './Pages/EventRequests'
import EditEventPage from './Pages/EditEventPage'
import ProtectedRoute from './Components/ProtectedRoute'


const router = createBrowserRouter([
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/', element: <Home /> },
      {path:'/event/:id', element: <EventDetailPage /> },

      {path:'/myEvents', element: (<ProtectedRoute><MyEvents /></ProtectedRoute>) },
      {path:'/registered', element: (<ProtectedRoute role="student"><RegisteredEvents /></ProtectedRoute>) },
      {path:'/requests', element: (<ProtectedRoute role="admin"><EventRequests /></ProtectedRoute>) },
      {
        path: '/event/:id/edit',
        element: (
          <ProtectedRoute role="admin">
            <EditEventPage />
          </ProtectedRoute>
        )
      },
    ]
  },
  {path:'/create-event', element: (<ProtectedRoute><CreateEventPage /></ProtectedRoute>) },
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