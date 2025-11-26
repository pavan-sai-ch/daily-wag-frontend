import React, { useState, useEffect } from 'react';
// Import the new service function
import { getPendingRequests, updateAdoptionStatus, addAdoptionPet } from '../../api/adoptionService.js';
// Import the PetFormModal we already built!
import PetFormModal from '../pets/PetFormModal.jsx';
import './AdminTables.css';

const AdoptionManagement = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getPendingRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch adoption requests");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDecision = async (adoptId, status) => {
        const confirm = window.confirm(`Are you sure you want to ${status} this request?`);
        if (!confirm) return;

        try {
            await updateAdoptionStatus(adoptId, status);
            alert(`Request ${status} successfully.`);
            setRequests(prev => prev.filter(req => req.adopt_id !== adoptId));
        } catch (error) {
            alert("Failed to update request.");
        }
    };

    // Handle Adding a New Pet for Adoption
    const handleAddSubmit = async (petData) => {
        try {
            await addAdoptionPet(petData);
            alert("Pet successfully listed for adoption!");
            setIsAddModalOpen(false);
            // Note: We don't update the 'requests' list here because
            // adding a pet creates an 'available' pet, not a 'pending request'.
            // The pet will immediately appear on the public Adoption Page.
        } catch (error) {
            alert("Failed to add pet.");
        }
    };

    if (isLoading) return <p>Loading requests...</p>;

    return (
        <div className="admin-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Manage Adoption Requests</h2>
                <button
                    className="action-btn approve"
                    style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Add Pet for Adoption
                </button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Applicant</th>
                    <th>Pet Requested</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {requests.length === 0 ? (
                    <tr><td colSpan="5" className="empty-cell">No pending adoption requests.</td></tr>
                ) : (
                    requests.map(req => (
                        <tr key={req.adopt_id}>
                            <td>{new Date(req.adoption_date).toLocaleDateString()}</td>
                            <td>
                                {req.first_name} {req.last_name}
                                <br/><small>{req.email || 'No email'}</small>
                            </td>
                            <td>
                                <strong>{req.pet_name}</strong> ({req.pet_breed})
                            </td>
                            <td>
                                <span className="status-pill pending">Pending</span>
                            </td>
                            <td className="actions-cell">
                                <button
                                    className="action-btn approve"
                                    onClick={() => handleDecision(req.adopt_id, 'approved')}>
                                    ✔ Approve
                                </button>
                                <button
                                    className="action-btn decline"
                                    onClick={() => handleDecision(req.adopt_id, 'denied')}>
                                    ✖ Deny
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Reusing the PetFormModal */}
            <PetFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubmit}
                isEditMode={false}
            />
        </div>
    );
};

export default AdoptionManagement;