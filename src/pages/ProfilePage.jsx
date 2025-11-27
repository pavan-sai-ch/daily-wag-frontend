import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ProfilePage.css';

// API Services
import { getPetsByUserId, addPet, updatePet, removePet } from '../api/petService.js';
import { getUserBookings } from '../api/appointmentService.js';
import { getMyOrders } from '../api/storeService.js';
import { updateProfile } from '../api/authService.js';
// Redux Actions
import { loginSuccess } from '../store/authSlice.js';

// Components
import PetList from '../components/pets/PetList.jsx';
import PetFormModal from '../components/pets/PetFormModal.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx'; // New Import

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // --- State ---
    const [activeTab, setActiveTab] = useState('pets');
    const [isLoading, setIsLoading] = useState(true);

    // Data
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);

    // Modal State
    const [selectedPet, setSelectedPet] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Profile Modal State

    // --- Fetch All Data on Load ---
    useEffect(() => {
        const loadDashboardData = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const [petsData, appsData, ordersData] = await Promise.all([
                        getPetsByUserId(user.id),
                        getUserBookings(),
                        getMyOrders()
                    ]);

                    setPets(petsData);
                    setAppointments(appsData);
                    setOrders(ordersData);
                } catch (error) {
                    console.error("Failed to load dashboard data:", error);
                }
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [user]);

    // --- Handlers ---

    const handleAddPetClick = () => setIsAddModalOpen(true);

    const handleEditPet = (pet) => {
        setSelectedPet(pet);
        setIsEditModalOpen(true);
    };

    const handleRemovePet = (pet) => {
        setSelectedPet(pet);
        setIsRemoveModalOpen(true);
    };

    const onAddSubmit = async (petData) => {
        try {
            const newPet = await addPet(petData, user.id);
            setPets([...pets, newPet]);
            setIsAddModalOpen(false);
        } catch (error) {
            alert("Failed to add pet.");
        }
    };

    const onUpdateSubmit = async (updatedData) => {
        try {
            const petToUpdate = { ...selectedPet, ...updatedData };
            await updatePet(petToUpdate);
            setPets(pets.map(p => p.pet_id === petToUpdate.pet_id ? petToUpdate : p));
            setIsEditModalOpen(false);
        } catch (error) {
            alert("Failed to update pet.");
        }
    };

    const onRemoveConfirm = async () => {
        try {
            await removePet(selectedPet.pet_id);
            setPets(pets.filter(p => p.pet_id !== selectedPet.pet_id));
            setIsRemoveModalOpen(false);
        } catch (error) {
            alert("Failed to remove pet.");
        }
    };

    // Handle Profile Update
    const handleUpdateProfile = async (updatedData) => {
        try {
            const updatedUser = await updateProfile(updatedData);
            // Update Redux Store immediately so UI reflects changes
            dispatch(loginSuccess(updatedUser));
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        }
    };

    // --- Render Helpers ---

    const renderPetsTab = () => (
        <div className="tab-section">
            <div className="section-header">
                <h2>My Pets</h2>
                <button className="add-btn" onClick={handleAddPetClick}>+ Add Pet</button>
            </div>
            {pets.length > 0 ? (
                <PetList pets={pets} onEditPet={handleEditPet} onRemovePet={handleRemovePet} />
            ) : (
                <p className="empty-state">You haven't added any pets yet.</p>
            )}
        </div>
    );

    const renderAppointmentsTab = () => (
        <div className="tab-section">
            <h2>My Appointments</h2>
            {appointments.length === 0 ? (
                <p className="empty-state">No upcoming appointments.</p>
            ) : (
                <table className="dashboard-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Service</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map(app => (
                        <tr key={app.booking_id}>
                            <td>{new Date(app.booking_date).toLocaleString()}</td>
                            <td><span className="type-badge">{app.booking_type}</span></td>
                            <td>{app.service_type}</td>
                            <td><span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderOrdersTab = () => (
        <div className="tab-section">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p className="empty-state">No past orders.</p>
            ) : (
                <table className="dashboard-table">
                    <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.order_id}>
                            <td>#{order.order_id}</td>
                            <td>{new Date(order.order_date).toLocaleDateString()}</td>
                            <td>${order.grand_total}</td>
                            <td>{order.delivery_type}</td>
                            <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    if (isLoading) return <div className="profile-container"><div className="loader"></div></div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {user.firstName}!</h1>

                {/* --- Profile Summary & Edit Button --- */}
                <div className="profile-details-summary">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
                    <p><strong>Address:</strong> {user.address || 'Not set'}</p>
                    <button className="edit-profile-btn" onClick={() => setIsProfileModalOpen(true)}>
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={activeTab === 'pets' ? 'active' : ''}
                    onClick={() => setActiveTab('pets')}
                >
                    🐾 My Pets
                </button>
                <button
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}
                >
                    📅 Appointments
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    📦 Orders
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'pets' && renderPetsTab()}
                {activeTab === 'appointments' && renderAppointmentsTab()}
                {activeTab === 'orders' && renderOrdersTab()}
            </div>

            {/* Modals */}
            <PetFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={onAddSubmit}
            />
            <PetFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={onUpdateSubmit}
                initialData={selectedPet}
                isEditMode={true}
            />
            <ConfirmModal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={onRemoveConfirm}
                title="Remove Pet"
                message={`Remove ${selectedPet?.pet_name}?`}
            />

            {/* --- Edit Profile Modal --- */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onUpdate={handleUpdateProfile}
            />
        </div>
    );
};

export default ProfilePage;