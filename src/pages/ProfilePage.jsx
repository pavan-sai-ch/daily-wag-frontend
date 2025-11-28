import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './ProfilePage.css';

// API Services
import { getPetsByUserId, addPet, updatePet, removePet } from '../api/petService.js';
import { getUserBookings, checkInBooking } from '../api/appointmentService.js';
import { getMyOrders } from '../api/storeService.js';
import { updateProfile } from '../api/authService.js';
import { getMembershipStatus } from '../api/membershipService.js';

// Redux Actions
import { loginSuccess } from '../store/authSlice.js';

// Components
import PetList from '../components/pets/PetList.jsx';
import PetFormModal from '../components/pets/PetFormModal.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    // --- State ---
    const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'pets');
    const [isLoading, setIsLoading] = useState(true);

    // Data
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [membership, setMembership] = useState(null);

    // Modal State
    const [selectedPet, setSelectedPet] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // --- Fetch All Data on Load ---
    useEffect(() => {
        const loadDashboardData = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const [petsData, appsData, ordersData, memberData] = await Promise.all([
                        getPetsByUserId(user.id),
                        getUserBookings(),
                        getMyOrders(),
                        getMembershipStatus()
                    ]);

                    setPets(petsData);
                    setAppointments(appsData);
                    setOrders(ordersData);
                    setMembership(memberData);
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
    const handleEditPet = (pet) => { setSelectedPet(pet); setIsEditModalOpen(true); };
    const handleRemovePet = (pet) => { setSelectedPet(pet); setIsRemoveModalOpen(true); };

    const onAddSubmit = async (petData) => {
        const tempId = 'temp_' + Date.now();
        const optimisticPet = {
            ...petData,
            pet_id: tempId,
            user_id: user.id,
            photo_url: petData.tempPreview || null,
            adoption_status: 'not_available'
        };

        setIsAddModalOpen(false);
        setPets(prevPets => [...prevPets, optimisticPet]);

        try {
            const newPet = await addPet(petData, user.id);
            setPets(prevPets => prevPets.map(p =>
                p.pet_id === tempId ? newPet : p
            ));
        } catch (error) {
            console.error("Failed to add pet:", error);
            alert("Failed to add pet. Please try again.");
            setPets(prevPets => prevPets.filter(p => p.pet_id !== tempId));
        }
    };

    const onUpdateSubmit = async (updatedData) => {
        const previousPets = [...pets];
        const optimisticPet = {
            ...selectedPet,
            ...updatedData,
            photo_url: updatedData.tempPreview || selectedPet.photo_url
        };

        setIsEditModalOpen(false);
        setPets(prevPets => prevPets.map(p =>
            p.pet_id === selectedPet.pet_id ? optimisticPet : p
        ));

        try {
            const result = await updatePet({ ...selectedPet, ...updatedData });
            setPets(prevPets => prevPets.map(p =>
                p.pet_id === selectedPet.pet_id ? result : p
            ));
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to update pet:", error);
            alert("Failed to update pet.");
            setPets(previousPets);
        }
    };

    const onRemoveConfirm = async () => {
        const previousPets = [...pets];
        const idToRemove = selectedPet.pet_id;

        setIsRemoveModalOpen(false);
        setPets(prevPets => prevPets.filter(p => p.pet_id !== idToRemove));

        try {
            await removePet(idToRemove);
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to remove pet:", error);
            alert("Failed to remove pet.");
            setPets(previousPets);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        const previousUser = { ...user };
        const optimisticUser = { ...user, ...updatedData };

        dispatch(loginSuccess(optimisticUser));
        setIsProfileModalOpen(false);

        try {
            const realUpdatedUser = await updateProfile(updatedData);
            dispatch(loginSuccess(realUpdatedUser));
        } catch (error) {
            alert("Failed to update profile: " + error.message);
            dispatch(loginSuccess(previousUser));
        }
    };

    // --- Check-In Handler ---
    const handleCheckIn = async (bookingId) => {
        try {
            await checkInBooking(bookingId);
            alert("Checked in successfully!");
            const updatedBookings = await getUserBookings();
            setAppointments(updatedBookings);
        } catch (error) {
            const msg = error.response?.data?.message || "Check-in failed.";
            alert(msg);
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
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map(app => {
                        const bookingDate = new Date(app.booking_date);
                        const bookingTime = bookingDate.getTime();
                        const now = Date.now();

                        const oneHourBefore = bookingTime - (60 * 60 * 1000);
                        const fifteenMinsAfter = bookingTime + (15 * 60 * 1000);

                        const isTooEarly = now < oneHourBefore;
                        const isTooLate = now > fifteenMinsAfter;
                        const isWindowOpen = !isTooEarly && !isTooLate;
                        const isConfirmed = app.status === 'Confirmed';

                        // --- UPDATED: Date Formatting ---
                        const checkInDateObj = new Date(oneHourBefore);
                        const timeStr = checkInDateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        const dateStr = checkInDateObj.toLocaleDateString([], {month: 'numeric', day: 'numeric', year: '2-digit'});

                        return (
                            <tr key={app.booking_id}>
                                <td>{bookingDate.toLocaleString()}</td>
                                <td><span className="type-badge">{app.booking_type}</span></td>
                                <td>{app.service_type}</td>
                                <td><span className={`status-badge ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span></td>
                                <td>
                                    {isConfirmed ? (
                                        isWindowOpen ? (
                                            <button
                                                className="action-btn approve"
                                                style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                                onClick={() => handleCheckIn(app.booking_id)}
                                            >
                                                CHECK IN
                                            </button>
                                        ) : isTooEarly ? (
                                            // --- UPDATED: Display Text ---
                                            <span style={{ color: '#999', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                    Opens at {timeStr} on {dateStr}
                                                </span>
                                        ) : (
                                            <span style={{ color: '#d93025', fontSize: '0.75rem' }}>
                                                    Missed
                                                </span>
                                        )
                                    ) : (
                                        <span style={{ color: '#ccc', fontSize: '0.8rem' }}>-</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
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
                <h1 className="welcome-title">
                    Welcome, {user.firstName}!
                    {membership && (
                        <span className={`membership-badge ${membership.plan_details.toLowerCase()}`}>
                            {membership.plan_details} MEMBER
                        </span>
                    )}
                </h1>

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

            <PetFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={onAddSubmit} />
            <PetFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={onUpdateSubmit} initialData={selectedPet} isEditMode={true} />
            <ConfirmModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} onConfirm={onRemoveConfirm} title="Remove Pet" message={`Remove ${selectedPet?.pet_name}?`} />
            <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} onUpdate={handleUpdateProfile} />
        </div>
    );
};

export default ProfilePage;