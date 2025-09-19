import React from 'react'
import { Outlet } from "react-router-dom";
import Header from './Header';

const Layout = () => {
  return (
    <div className='w-full min-h-screen'>
        <Header />
        <div className='w-full h-full'>
            <Outlet />
        </div>
    </div>
  )
}

export default Layout