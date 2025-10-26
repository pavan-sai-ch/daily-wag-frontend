import React, { useState, useEffect } from 'react';
import { getDoctors, updateDoctorHours } from '../../api/doctorService'; // <-- THE FIX IS HERE
import './DoctorDashboard.css';

const DoctorHours = ({ doctorId }) => {
    const [hours, setHours] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch initial hours
    useEffect(() => {
        // Use the corrected function name here
        const doc = getDoctors().find(d => d.id === doctorId);
        if (doc) {
            setHours(doc.clinicHours);
        }
    }, [doctorId]);

    const handleSave = async () => {
        try {
            await updateDoctorHours(doctorId, hours);
            setIsEditing(false);
            alert("Hours updated!");
        } catch (error) {
            alert("Failed to update hours.");
        }
    };

    return (
        <div className="dashboard-widget">
            <h3>My Clinic Hours</h3>
            {isEditing ? (
                <>
                    <textarea
                        className="hours-textarea"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                    />
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    {/* <pre> tag respects whitespace and newlines, good for this */}
                    <pre className="hours-display">{hours}</pre>
                    <button className="edit-button" onClick={() => setIsEditing(true)}>Update Hours</button>
                </>
            )}
        </div>
    );
};

export default DoctorHours;
