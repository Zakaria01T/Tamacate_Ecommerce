// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="flex flex-col justify-between h-screen overflow-y-scroll hide-scrollbar">
            <Header />
            <main className="">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;