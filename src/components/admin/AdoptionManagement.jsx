import React, { useState, useEffect } from 'react';
import { getPendingRequests, updateAdoptionStatus, addAdoptionPet } from '../../api/adoptionService.js';
import PetFormModal from '../pets/PetFormModal.jsx';
import './AdminTables.css';

const AdoptionManagement = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getPendingRequests();
            setRequests(data || []);
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

    const handleAddSubmit = async (petData) => {
        try {
            await addAdoptionPet(petData);
            alert("Pet successfully listed for adoption!");
            setIsAddModalOpen(false);
        } catch (error) {
            alert("Failed to add pet.");
        }
    };

    if (isLoading) return <p className="loading-text">LOADING REQUESTS...</p>;

    return (
        <div className="admin-table-container">
            <div className="admin-controls-header">
                <h2>MANAGE ADOPTION REQUESTS</h2>
                <button
                    className="action-btn add-new"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + ADD PET
                </button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th style={{width: '15%'}}>DATE</th>
                    <th style={{width: '25%'}}>APPLICANT</th>
                    <th style={{width: '20%'}}>PET</th>
                    <th style={{width: '15%'}}>STATUS</th>
                    {/* FIX: Changed textAlign from right to center */}
                    <th style={{width: '25%', textAlign: 'center'}}>ACTIONS</th>
                </tr>
                </thead>
                <tbody>
                {requests.length === 0 ? (
                    <tr><td colSpan="5" className="empty-cell">NO PENDING REQUESTS.</td></tr>
                ) : (
                    requests.map(req => (
                        <tr key={req.adopt_id}>
                            <td className="date-cell">{new Date(req.adoption_date).toLocaleDateString()}</td>
                            <td className="applicant-cell">
                                <div>
                                    <span className="applicant-name">{req.first_name} {req.last_name}</span>
                                    <span className="applicant-email">{req.email || 'Email Unavailable'}</span>
                                </div>
                            </td>
                            <td className="pet-cell">
                                <div>
                                    <span className="pet-name-bold">{req.pet_name}</span>
                                    <span className="pet-breed-sub">{req.pet_breed}</span>
                                </div>
                            </td>
                            <td>
                                <span className="status-pill pending">PENDING</span>
                            </td>
                            <td className="actions-cell">
                                {/* Wrapper will now justify-center via CSS */}
                                <div className="action-buttons-wrapper">
                                    <button
                                        className="action-btn approve"
                                        onClick={() => handleDecision(req.adopt_id, 'approved')}>
                                        APPROVE
                                    </button>
                                    <button
                                        className="action-btn decline"
                                        onClick={() => handleDecision(req.adopt_id, 'denied')}>
                                        DENY
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

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