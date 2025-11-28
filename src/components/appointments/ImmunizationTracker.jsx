import React, { useState, useEffect } from 'react';
import { getImmunizationRecords, addImmunizationRecord } from '../../api/petService.js';
import AddImmunizationModal from './AddImmunizationModal.jsx';
import './ImmunizationTracker.css';

/**
 * Component to display and manage immunization records for a selected pet.
 */
const ImmunizationTracker = ({ selectedPetId }) => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Data whenever selectedPetId changes
    const fetchRecords = async () => {
        if (!selectedPetId) {
            setRecords([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const petRecords = await getImmunizationRecords(selectedPetId);
            setRecords(petRecords);
        } catch (err) {
            console.error("Failed to fetch records:", err);
            setError("Could not load records.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRecords();
    }, [selectedPetId]);

    // Handle Adding New Record
    const handleAddRecord = async (recordData) => {
        try {
            // Add pet_id to the data payload
            await addImmunizationRecord({ ...recordData, pet_id: selectedPetId });

            alert("Record added successfully!");
            setIsModalOpen(false);

            // Refresh the list to show the new record
            fetchRecords();
        } catch (err) {
            console.error(err);
            alert("Failed to save record.");
        }
    };

    const renderContent = () => {
        if (!selectedPetId) {
            return <p className="tracker-message">Please select a pet above to view their medical history.</p>;
        }
        if (isLoading) {
            return <p className="tracker-message">Loading records...</p>;
        }
        if (error) {
            return <p className="tracker-message error">{error}</p>;
        }

        return (
            <>
                {records.length === 0 ? (
                    <p className="tracker-message">No immunization records found for this pet.</p>
                ) : (
                    <table className="immunization-table">
                        <thead>
                        <tr>
                            <th>Treatment</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Notes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map(record => (
                            <tr key={record.immun_id}>
                                <td><strong>{record.vaccine_name}</strong></td>
                                <td>{record.vaccine_date}</td>
                                <td>{record.due_date || '-'}</td>
                                <td className="notes-cell">{record.comments || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </>
        );
    };

    return (
        <div className="immunization-container">
            <div className="tracker-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '4px solid #000', paddingBottom: '0.5rem' }}>
                <h3 style={{ border: 'none', margin: 0, padding: 0 }}>Medical Records</h3>

                {/* Add Button (Only shows if a pet is selected) */}
                {selectedPetId && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0',
                            padding: '8px 16px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        + Add Record
                    </button>
                )}
            </div>

            {renderContent()}

            {/* Add Record Modal */}
            <AddImmunizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddRecord}
                petName="Selected Pet"
            />
        </div>
    );
};

export default ImmunizationTracker;