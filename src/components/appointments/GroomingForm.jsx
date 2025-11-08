import React, { useState } from 'react';
import './GroomingForm.css';
import { bookGrooming } from '/src/api/appointmentService.js';

const GroomingForm = ({ pets, selectedPetId, userId }) => {
    // Form state
    const [serviceType, setServiceType] = useState('Basic Wash');
    const [dateTime, setDateTime] = useState('');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- THIS IS THE FIX ---
    // We use (pets || []) to provide a default empty array
    // This prevents the .find() method from crashing if 'pets' is undefined.
    const selectedPet = (pets || []).find(p => p.id === selectedPetId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPetId) {
            alert('Please select a pet first.');
            return;
        }
        if (!dateTime) {
            alert('Please select a date and time.');
            return;
        }

        setIsLoading(true);
        const appointmentData = {
            userId,
            petId: selectedPetId,
            serviceType,
            dateTime,
            comments,
        };

        try {
            await bookGrooming(appointmentData);
            alert(`Appointment requested for ${selectedPet.name}! An admin will confirm it soon.`);
            // Clear the form
            setDateTime('');
            setComments('');
        } catch (error) {
            console.error("Failed to book grooming:", error);
            alert("Failed to book appointment. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="appointment-form-container">
            <h3>Book a Grooming Service</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="grooming-service">Service Type</label>
                    <select
                        id="grooming-service"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value="Basic Wash">Basic Wash</option>
                        <option value="Premium Groom">Premium Groom (Wash & Cut)</option>
                        <option value="Luxury Spa">Luxury Spa (All included)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="grooming-datetime">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="grooming-datetime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="grooming-comments">Additional Comments (Optional)</label>
                    <textarea
                        id="grooming-comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g., uses sensitive skin shampoo, gets nervous..."
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isLoading || !selectedPetId}>
                    {isLoading ? 'Booking...' : (selectedPetId ? 'Request Appointment' : 'Please select a pet')}
                </button>
            </form>
        </div>
    );
};

export default GroomingForm;

