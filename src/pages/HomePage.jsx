import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomePage.css'; // We'll create this CSS next

const HomePage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="home-container">
            {/* --- Hero Section --- */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Happy Pets, Happy Life</h1>
                    <p>Your one-stop destination for veterinary care, grooming, and pet essentials.</p>

                    {!isAuthenticated ? (
                        <div className="hero-buttons">
                            <Link to="/login" className="btn btn-primary">Login / Sign Up</Link>
                            <Link to="/store" className="btn btn-outline">Browse Store</Link>
                        </div>
                    ) : (
                        <div className="hero-buttons">
                            <Link to="/profile" className="btn btn-primary">Go to Dashboard</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="features-section">
                <h2>Our Services</h2>
                <div className="features-grid">

                    {/* Feature 1: Appointments */}
                    <div className="feature-card">
                        <div className="icon">📅</div>
                        <h3>Veterinary & Grooming</h3>
                        <p>Book checkups with expert doctors or pamper your pet with our grooming services.</p>
                        <Link to="/appointments" className="link-text">Book Now &rarr;</Link>
                    </div>

                    {/* Feature 2: Store */}
                    <div className="feature-card">
                        <div className="icon">🦴</div>
                        <h3>Pet Essentials Store</h3>
                        <p>Shop for premium food, toys, and accessories delivered right to your door.</p>
                        <Link to="/store" className="link-text">Shop Now &rarr;</Link>
                    </div>

                    {/* Feature 3: Adoption */}
                    <div className="feature-card">
                        <div className="icon">🏠</div>
                        <h3>Adoption Center</h3>
                        <p>Find your new best friend. Browse pets looking for a forever home.</p>
                        <Link to="/adoption" className="link-text">Meet Pets &rarr;</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;