import React, { useState } from 'react';
import './AdminDashboardPage.css';
import AppointmentManagement from '../components/admin/AppointmentManagement';
// Import your placeholder components
// import UserManagement from '../components/admin/UserManagement';
// import AdoptionManagement from '../components/admin/AdoptionManagement';
// import StoreManagement from '../components/admin/StoreManagement';

const AdminDashboardPage = () => {
    // We'll use state to manage which tab is active
    const [activeTab, setActiveTab] = useState('appointments');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentManagement />;
            case 'users':
                return <div><h2>User Management (Coming Soon)</h2></div>;
            case 'adoption':
                return <div><h2>Adoption Management (Coming Soon)</h2></div>;
            case 'store':
                return <div><h2>Store Management (Coming Soon)</h2></div>;
            default:
                return <AppointmentManagement />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
            </div>

            <nav className="admin-tab-nav">
                <button
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}>
                    Appointments
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}>
                    Users
                </button>
                <button
                    className={activeTab === 'adoption' ? 'active' : ''}
                    onClick={() => setActiveTab('adoption')}>
                    Adoption
                </button>
                <button
                    className={activeTab === 'store' ? 'active' : ''}
                    onClick={() => setActiveTab('store')}>
                    Store
                </button>
            </nav>

            <main className="admin-tab-content">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default AdminDashboardPage;