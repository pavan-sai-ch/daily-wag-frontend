import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomePage.css';

const HomePage = () => {
    // Check if user is logged in to change the Hero button text
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="home-container">
            {/* --- Hero Section: High Impact --- */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">THE DAILY WAG</h1>
                    <p className="hero-subtitle">ELITE VETERINARY MEDICINE & LUXURY PET SPA</p>

                    {!isAuthenticated ? (
                        <Link to="/login" className="btn-hero">ENTER EXPERIENCE</Link>
                    ) : (
                        <Link to="/profile" className="btn-hero">DASHBOARD</Link>
                    )}
                </div>
            </section>

            {/* --- 2x2 Services Flip Grid --- */}
            <section className="services-grid">

                {/* 1. THE SALON (Grooming) */}
                <div className="flip-card">
                    <div className="flip-card-inner">
                        {/* Front: Image */}
                        <div className="flip-card-front">
                            <img
                                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop"
                                alt="Salon"
                            />
                            <div className="front-overlay">
                                <h2>THE SALON</h2>
                            </div>
                        </div>
                        {/* Back: Details & Link */}
                        <div className="flip-card-back">
                            <h3>PREMIUM GROOMING</h3>
                            <p>ORGANIC WASHES. PRECISION CUTS. LUXURY TREATMENT.</p>
                            <Link to="/appointments" className="btn-flip">BOOK APPOINTMENT</Link>
                        </div>
                    </div>
                </div>

                {/* 2. THE STORE */}
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img
                                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop"
                                alt="Store"
                            />
                            <div className="front-overlay">
                                <h2>THE STORE</h2>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <h3>ESSENTIALS</h3>
                            <p>HIGH-GRADE NUTRITION. DURABLE GEAR. DELIVERED.</p>
                            <Link to="/store" className="btn-flip">SHOP COLLECTION</Link>
                        </div>
                    </div>
                </div>

                {/* 3. THE CLINIC (Doctor) */}
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img
                                src="https://images.unsplash.com/photo-1553688738-a278b9f063e0?q=80&w=2070&auto=format&fit=crop"
                                alt="Doctor"
                            />
                            <div className="front-overlay">
                                <h2>THE CLINIC</h2>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <h3>VETERINARY MEDICINE</h3>
                            <p>EXPERT DIAGNOSTICS. SURGERY. PREVENTATIVE CARE.</p>
                            <Link to="/appointments" className="btn-flip">CONSULT EXPERTS</Link>
                        </div>
                    </div>
                </div>

                {/* 4. ADOPTION */}
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img
                                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2574&auto=format&fit=crop"
                                alt="Adoption"
                            />
                            <div className="front-overlay">
                                <h2>ADOPTION</h2>
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <h3>FIND A FRIEND</h3>
                            <p>RESCUE ANIMALS LOOKING FOR THEIR FOREVER HOME.</p>
                            <Link to="/adoption" className="btn-flip">VIEW CANDIDATES</Link>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default HomePage;