import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDoctors } from '../../api/doctorService';
import {bookDoctorAppointment, bookGrooming} from '../../api/appointmentService';
import './DoctorBookingForm.css'
/**
 * Component for the Doctor booking form.
 * This is displayed inside the "Medical" tab.
 * * @param {object} props
 * @param {string} props.selectedPetId - The ID of the pet selected on the main page.
 */
const DoctorBookingForm = ({ selectedPetId }) => {
    const { user } = useSelector((state) => state.auth);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Form fields state
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [serviceType, setServiceType] = useState('checkup');
    const [dateTime, setDateTime] = useState('');
    const [comments, setComments] = useState('');

    // Fetch the list of doctors when the component mounts
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const doctorList = await getDoctors();
                setDoctors(doctorList);
                // Set a default doctor if list is not empty
                if (doctorList.length > 0) {
                    setSelectedDoctorId(doctorList[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
                setMessage({ type: 'error', text: 'Could not load doctor list.' });
            }
        };
        fetchDoctors();
    }, []); // Empty array ensures this runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPetId) {
            setMessage({ type: 'error', text: 'Please select a pet first.' });
            return;
        }
        if (!dateTime || !selectedDoctorId) {
            setMessage({ type: 'error', text: 'Please select a doctor and a date/time.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const appointmentData = {
            userId: user.id,
            petId: selectedPetId,
            doctorId: selectedDoctorId,
            type: 'Medical', // Main category
            service: serviceType, // Specific service
            dateTime: dateTime,
            comments: comments,
        };

        try {
            await bookGrooming(appointmentData);
            setMessage({ type: 'success', text: 'Doctor appointment booked successfully!' });

            // Reset form
            setServiceType('checkup');
            setDateTime('');
            setComments('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to book appointment. Please try again.' });
            console.error("Booking failed:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="appointment-form-container">
            <h3>Book a Doctor Appointment</h3>
            <p>Select a doctor, service, and time for your pet.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="doctorSelect">Doctor</label>
                    <select
                        id="doctorSelect"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                    >
                        {doctors.length === 0 ? (
                            <option value="">Loading doctors...</option>
                        ) : (
                            doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="medicalService">Service Type</label>
                    <select
                        id="medicalService"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value="checkup">General Check-up</option>
                        <option value="vaccination">Vaccination</option>
                        <option value="consultation">Specialist Consultation</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="medicalDateTime">Date and Time</label>
                    <input
                        type="datetime-local"
                        id="medicalDateTime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)} // Prevent booking in the past
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="medicalComments">Reason for Visit (Optional)</label>
                    <textarea
                        id="medicalComments"
                        rows="3"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="E.g., coughing, annual checkup, skin irritation..."
                    ></textarea>
                </div>

                <button type="submit" className="submit-button" disabled={!selectedPetId || isLoading}>
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                </button>

                {message && (
                    <p className={`form-message ${message.type}`}>
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
};

export default DoctorBookingForm;