import React from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
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
import { useUser } from "@/Context/UserContext";


// Wrapper that checks if logged-in user is an admin role
const AdminRoute = ({ children }) => {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user) return <Navigate to="/signin" replace />
  if (user.role !== 'admin') return <Navigate to="*" replace />

  return children
}


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
      {path:'/requests', element: <EventRequests /> },
      {path:'/event/:id', element: <EventDetailPage /> },
      {
        path: '/event/:id/edit',
        element: (
          <AdminRoute>
            <EditEventPage />
          </AdminRoute>
        )
      },
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