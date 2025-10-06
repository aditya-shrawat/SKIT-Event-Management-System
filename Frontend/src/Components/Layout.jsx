import React from 'react'
import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='w-full min-h-screen'>
        <Header />
        <div className='w-full h-full'>
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default Layout