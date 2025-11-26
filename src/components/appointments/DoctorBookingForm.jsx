import React, { useState, useEffect } from 'react';
import './DoctorBookingForm.css';
import { bookDoctorAppointment } from '../../api/appointmentService.js';
import { getDoctors } from '../../api/doctorService.js';

const DoctorBookingForm = ({ pets, selectedPetId, userId }) => {
    // Form state
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [serviceType, setServiceType] = useState('Check-up');
    const [dateTime, setDateTime] = useState('');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch doctors on component load
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const doctorsList = await getDoctors();
                setDoctors(doctorsList);
                if (doctorsList.length > 0) {
                    setSelectedDoctorId(doctorsList[0].id); // Default to first doctor
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            }
        };
        fetchDoctors();
    }, []);

    // Safe find logic
    const selectedPet = (pets || []).find(p => p.pet_id === selectedPetId);

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
        if (!selectedDoctorId) {
            alert('Please select a doctor.');
            return;
        }

        setIsLoading(true);
        const appointmentData = {
            userId,
            petId: selectedPetId,
            doctorId: selectedDoctorId,
            serviceType,
            dateTime,
            comments,
        };

        try {
            await bookDoctorAppointment(appointmentData);

            alert(`Appointment requested for ${selectedPet ? selectedPet.pet_name : 'your pet'}! An admin will confirm it soon.`);
            // Clear the form
            setDateTime('');
            setComments('');
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

                <div className="form-group">
                    <label htmlFor="doctor-datetime">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="doctor-datetime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="doctor-comments">Comments / Reason for Visit</label>
                    <textarea
                        id="doctor-comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g., vaccination records, symptoms..."
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isLoading || !selectedPetId}>
                    {isLoading ? 'Booking...' : (selectedPetId ? 'Request Appointment' : 'Please select a pet')}
                </button>
            </form>
        </div>
    );
};

export default DoctorBookingForm;