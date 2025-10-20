import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App(){
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main>
                    <AppRouter />
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    )
}