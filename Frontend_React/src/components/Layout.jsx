// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useSelector } from 'react-redux';

const Layout = () => {
    const { userInfo } = useSelector((state) => state.auth)
    return (
        <div className="flex flex-col justify-between h-screen overflow-y-scroll hide-scrollbar "  >
            <Header />
            <main className='h-screan flex-grow'  >
                <Outlet />
            </main>
            {userInfo?.isAdmin != 1 && <Footer />}
        </div>
    );
};

export default Layout;