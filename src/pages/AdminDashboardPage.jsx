import React, { useState } from 'react';
import './AdminDashboardPage.css';

// Import management components
import AppointmentManagement from '../components/admin/AppointmentManagement.jsx';
import OrderManagement from '../components/admin/OrderManagement.jsx';
import AdoptionManagement from '../components/admin/AdoptionManagement.jsx';
import UserManagement from '../components/admin/UserManagement.jsx';
// --- NEW IMPORT ---
import InventoryManagement from '../components/admin/InventoryManagement.jsx';

const AdminDashboardPage = () => {
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState('appointments');

    // Helper function to render the correct component based on state
    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentManagement />;
            case 'adoption':
                return <AdoptionManagement />;
            case 'orders': // Renamed 'store' to 'orders' for clarity
                return <OrderManagement />;
            case 'inventory': // --- NEW CASE ---
                return <InventoryManagement />;
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
                <p>Manage appointments, inventory, orders, and users.</p>
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
                    Adoption
                </button>

                <button
                    className={activeTab === 'inventory' ? 'active' : ''}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory {/* New Tab */}
                </button>

                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
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