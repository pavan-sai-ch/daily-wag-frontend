import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToPlan } from '../api/membershipService.js';
import './MembershipPage.css';

const MembershipPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (plan) => {
        if (!window.confirm(`Confirm subscription to ${plan} Plan?`)) return;

        setIsLoading(true);
        try {
            await subscribeToPlan(plan);
            alert(`Successfully subscribed to ${plan}!`);
            navigate('/profile'); // Redirect to profile to see status
        } catch (error) {
            alert("Subscription failed. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="membership-container">
            <div className="membership-header">
                <h1>MEMBERSHIP</h1>
                <p>UNLOCK EXCLUSIVE PERKS & PRIORITY CARE.</p>
            </div>

            <div className="plans-grid">
                {/* SILVER PLAN */}
                <div className="plan-card">
                    <div className="plan-name">SILVER</div>
                    <div className="plan-price">$9.99<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>5% Store Discount</li>
                        <li>Priority Grooming Booking</li>
                        <li>Basic Health Tracking</li>
                    </ul>
                    <button
                        className="plan-btn"
                        onClick={() => handleSubscribe('Silver')}
                        disabled={isLoading}
                    >
                        SELECT
                    </button>
                </div>

                {/* GOLD PLAN */}
                <div className="plan-card featured">
                    <div className="plan-name">GOLD</div>
                    <div className="plan-price">$19.99<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>Everything in Basic included</li>
                        <li>Free Delivery</li>
                        <li>Priority Vet Booking</li>
                        <li>24/7 Chat Support</li>
                    </ul>
                    <button
                        className="plan-btn"
                        onClick={() => handleSubscribe('Gold')}
                        disabled={isLoading}
                    >
                        SELECT
                    </button>
                </div>

                {/* PLATINUM PLAN */}
                <div className="plan-card">
                    <div className="plan-name">PLATINUM</div>
                    <div className="plan-price">$49.99<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>Everything in Gold included</li>
                        <li>Waiver on Emergency bookings</li>
                        <li>Dedicated Vet Line</li>
                        <li>Free Annual Checkup</li>
                        <li>Exclusive Merch and Many More!</li>
                    </ul>
                    <button
                        className="plan-btn"
                        onClick={() => handleSubscribe('Platinum')}
                        disabled={isLoading}
                    >
                        SELECT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;