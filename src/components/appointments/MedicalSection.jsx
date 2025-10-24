import React from 'react';
import DoctorBookingForm from './DoctorBookingForm.jsx';
import ImmunizationTracker from './ImmunizationTracker.jsx';

/**
 * A container component that renders the two parts of the "Medical" tab:
 * 1. The doctor booking form.
 * 2. The immunization tracker.
 * It passes the selectedPetId prop down to both children.
 * * @param {object} props
 * @param {string} props.selectedPetId - The ID of the pet selected on the main page.
 */
const MedicalSection = ({ selectedPetId }) => {
    return (
        <div>
            {/* --- Doctor Booking Form --- */}
            <DoctorBookingForm selectedPetId={selectedPetId} />

            {/* --- Immunization Tracker --- */}
            <ImmunizationTracker selectedPetId={selectedPetId} />
        </div>
    );
};

export default MedicalSection;
