import React, { useState, useEffect } from 'react';
import './DoctorBookingForm.css';
import { bookDoctorAppointment } from '../../api/appointmentService.js';
import { getDoctors } from '../../api/doctorService.js';
import { getAvailableSlots } from '../../api/scheduleService.js'; // Import the schedule service

const DoctorBookingForm = ({ pets, selectedPetId, userId }) => {
    // Form state
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [serviceType, setServiceType] = useState('Check-up');

    // New State for Slots
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null); // Stores the full datetime string

    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch doctors on component load
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const doctorsList = await getDoctors();
                setDoctors(doctorsList);
                if (doctorsList.length > 0) {
                    setSelectedDoctorId(doctorsList[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            }
        };
        fetchDoctors();
    }, []);

    // Fetch Slots whenever Date or Doctor changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate || !selectedDoctorId) return;

            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setSelectedSlot(null); // Reset selection when date changes

            try {
                const slots = await getAvailableSlots(selectedDate, selectedDoctorId);
                setAvailableSlots(slots);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            }
            setIsLoadingSlots(false);
        };

        fetchSlots();
    }, [selectedDate, selectedDoctorId]);

    // Safe find logic
    const selectedPet = (pets || []).find(p => p.pet_id === selectedPetId);

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
            doctorId: selectedDoctorId,
            serviceType,
            dateTime: selectedSlot, // Use the slot value we saved
            comments,
        };

        try {
            await bookDoctorAppointment(appointmentData);
            alert(`Appointment requested for ${selectedPet ? selectedPet.pet_name : 'your pet'}!`);
            // Reset form
            setComments('');
            setSelectedSlot(null);
            setAvailableSlots([]);
            setSelectedDate('');
        } catch (error) {
            console.error("Failed to book appointment:", error);
            alert("Failed to book appointment. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="appointment-form-container">
            <h3>Book a Doctor's Appointment</h3>
            <form onSubmit={handleSubmit}>
                {/* Doctor Selection */}
                <div className="form-group">
                    <label htmlFor="doctor-select">Doctor</label>
                    <select
                        id="doctor-select"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                    >
                        {doctors.length > 0 ? (
                            doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))
                        ) : (
                            <option value="">Loading doctors...</option>
                        )}
                    </select>
                </div>

                {/* Service Selection */}
                <div className="form-group">
                    <label htmlFor="doctor-service">Service Type</label>
                    <select
                        id="doctor-service"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value="Check-up">Annual Check-up</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Injury">Injury/Sickness</option>
                        <option value="Other">Other (See comments)</option>
                    </select>
                </div>

                {/* Date Selection */}
                <div className="form-group">
                    <label htmlFor="doctor-date">Date</label>
                    <input
                        type="date"
                        id="doctor-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Disable past dates
                    />
                </div>

                {/* Time Slot Grid */}
                {selectedDate && (
                    <div className="form-group">
                        <label>Available Time Slots</label>
                        {isLoadingSlots ? (
                            <div className="slots-loading">Finding available times...</div>
                        ) : availableSlots.length === 0 ? (
                            <div className="no-slots">No slots available on this date.</div>
                        ) : (
                            <div className="slots-grid">
                                {availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button" // Prevent form submission
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
                    <label htmlFor="doctor-comments">Comments / Reason for Visit</label>
                    <textarea
                        id="doctor-comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g., vaccination records, symptoms..."
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isLoading || !selectedPetId || !selectedSlot}>
                    {isLoading ? 'Booking...' : (selectedPetId ? 'Request Appointment' : 'Please select a pet')}
                </button>
            </form>
        </div>
    );
};

export default DoctorBookingForm;