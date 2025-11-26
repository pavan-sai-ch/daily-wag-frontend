import React, { useState } from 'react';
import './AdminDashboardPage.css';

// Import the management components
// These must exist in src/components/admin/ for the dashboard to work
import AppointmentManagement from '../components/admin/AppointmentManagement.jsx';
import OrderManagement from '../components/admin/OrderManagement.jsx';
import AdoptionManagement from '../components/admin/AdoptionManagement.jsx';
import UserManagement from '../components/admin/UserManagement.jsx';

const AdminDashboardPage = () => {
    // State to track the currently active tab
    // Default to 'appointments' as it's usually the most frequent task
    const [activeTab, setActiveTab] = useState('appointments');

    // Helper function to render the correct component based on state
    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentManagement />;
            case 'adoption':
                return <AdoptionManagement />;
            case 'store':
                return <OrderManagement />;
            case 'users':
                return <UserManagement />;
            default:
                return <AppointmentManagement />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage appointments, orders, users, and adoption requests.</p>
            </div>

            {/* Tab Navigation Bar */}
            <nav className="admin-tab-nav">
                <button
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
                <button
                    className={activeTab === 'adoption' ? 'active' : ''}
                    onClick={() => setActiveTab('adoption')}
                >
                    Adoption Requests
                </button>
                <button
                    className={activeTab === 'store' ? 'active' : ''}
                    onClick={() => setActiveTab('store')}
                >
                    Store Orders
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
            </nav>

            {/* Main Content Area */}
            <main className="admin-tab-content">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default AdminDashboardPage;