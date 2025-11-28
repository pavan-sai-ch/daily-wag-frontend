import React, { useState, useEffect } from 'react';
import './GroomingForm.css';
import { bookGrooming } from '../../api/appointmentService.js';
import { getAvailableSlots } from '../../api/scheduleService.js'; // Import schedule service

const GroomingForm = ({ pets, selectedPetId, userId }) => {
    // Form state
    const [serviceType, setServiceType] = useState('Basic Wash');

    // --- NEW: Slot State ---
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null); // Stores full ISO datetime
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Safe find logic
    const selectedPet = (pets || []).find(p => p.pet_id === selectedPetId);

    // --- NEW: Fetch Slots when Date Changes ---
    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) return;

            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setSelectedSlot(null);

            try {
                // Pass ONLY the date. The backend treats doctorId=null as "Grooming Schedule"
                const slots = await getAvailableSlots(selectedDate, null);
                setAvailableSlots(slots);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            }
            setIsLoadingSlots(false);
        };

        fetchSlots();
    }, [selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPetId) {
            alert('Please select a pet first.');
            return;
        }
        if (!selectedSlot) {
            alert('Please select a time slot.');
            return;
        }

        setIsLoading(true);

        const appointmentData = {
            userId,
            petId: selectedPetId,
            serviceType,
            dateTime: selectedSlot, // Use the selected slot
            comments,
        };

        try {
            await bookGrooming(appointmentData);

            alert(`Grooming booked for ${selectedPet ? selectedPet.pet_name : 'your pet'}!`);

            // Reset form
            setSelectedDate('');
            setAvailableSlots([]);
            setSelectedSlot(null);
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

                {/* --- NEW: Date Picker --- */}
                <div className="form-group">
                    <label htmlFor="grooming-date">Date</label>
                    <input
                        type="date"
                        id="grooming-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* --- NEW: Slot Grid --- */}
                {selectedDate && (
                    <div className="form-group">
                        <label>Available Time Slots (Mon-Fri, 9-5)</label>
                        {isLoadingSlots ? (
                            <div className="slots-loading">Finding available times...</div>
                        ) : availableSlots.length === 0 ? (
                            <div className="no-slots">No slots available on this date.</div>
                        ) : (
                            <div className="slots-grid">
                                {availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`slot-btn ${slot.available ? 'available' : 'booked'} ${selectedSlot === slot.value ? 'selected' : ''}`}
                                        disabled={!slot.available}
                                        onClick={() => setSelectedSlot(slot.value)}
                                    >
                                        {slot.display}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="grooming-comments">Additional Comments (Optional)</label>
                    <textarea
                        id="grooming-comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g., uses sensitive skin shampoo, gets nervous..."
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isLoading || !selectedPetId || !selectedSlot}>
                    {isLoading ? 'Booking...' : (selectedPetId ? 'Request Grooming' : 'Please select a pet')}
                </button>
            </form>
        </div>
    );
};

export default GroomingForm;