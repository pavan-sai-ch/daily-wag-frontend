import React, { useState, useEffect } from 'react';
import { getImmunizationRecords } from '../../api/petService';
import './ImmunizationTracker.css'; // We'll create this CSS file

/**
 * Component to display immunization records for a selected pet.
 * This is displayed inside the "Medical" tab.
 * * @param {object} props
 * @param {string} props.selectedPetId - The ID of the pet selected on the main page.
 */
const ImmunizationTracker = ({ selectedPetId }) => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // This effect re-runs whenever the selectedPetId changes
    useEffect(() => {
        if (!selectedPetId) {
            setRecords([]); // Clear records if no pet is selected
            return;
        }

        const fetchRecords = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const petRecords = await getImmunizationRecords(selectedPetId);
                setRecords(petRecords);
            } catch (err) {
                console.error("Failed to fetch immunization records:", err);
                setError("Could not load records. Please try again.");
            }
            setIsLoading(false);
        };

        fetchRecords();
    }, [selectedPetId]);

    const renderContent = () => {
        if (!selectedPetId) {
            return <p className="tracker-message">Please select a pet to view their records.</p>;
        }
        if (isLoading) {
            return <p className="tracker-message">Loading records...</p>;
        }
        if (error) {
            return <p className="tracker-message error">{error}</p>;
        }
        if (records.length === 0) {
            return <p className="tracker-message">No immunization records found for this pet.</p>;
        }

        return (
            <table className="immunization-table">
                <thead>
                <tr>
                    <th>Vaccine/Treatment</th>
                    <th>Last Administered</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {records.map(record => (
                    <tr key={record.id}>
                        <td>{record.name}</td>
                        <td>{record.date}</td>
                        <td>
                                <span className={`status-badge status-${record.status.toLowerCase().replace(' ', '-')}`}>
                                    {record.status}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="immunization-tracker-container">
            <h4>Immunization &amp; Health Records</h4>
            {renderContent()}
        </div>
    );
};

export default ImmunizationTracker;

