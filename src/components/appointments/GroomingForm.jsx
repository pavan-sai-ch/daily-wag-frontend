import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { bookAppointment } from '../../api/appointmentService.js';
import './GroomingForm.css'
/**
 * Component for the Grooming booking form.
 * This is displayed inside a tab on the AppointmentsPage.
 * * @param {object} props
 * @param {string} props.selectedPetId - The ID of the pet selected on the main page.
 */
const GroomingForm = ({ selectedPetId }) => {
    const { user } = useSelector((state) => state.auth); // Get user from Redux
    const [service, setService] = useState('basic');
    const [dateTime, setDateTime] = useState('');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // To show success/error messages

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!selectedPetId) {
            setMessage({ type: 'error', text: 'Please select a pet first.' });
            return;
        }
        if (!dateTime) {
            setMessage({ type: 'error', text: 'Please select a date and time.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const appointmentData = {
            userId: user.id,
            petId: selectedPetId,
            type: 'Grooming', // As defined in your project proposal
            service: service,
            dateTime: dateTime,
            comments: comments,
        };

        try {
            await bookAppointment(appointmentData);
            setMessage({ type: 'success', text: 'Grooming appointment booked successfully!' });

            // Reset form
            setService('basic');
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
            <h3>Book a Grooming Session</h3>
            <p>Select a service and a time for your pet.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groomingService">Service Type</label>
                    <select
                        id="groomingService"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                    >
                        <option value="basic">Basic Wash</option>
                        <option value="premium">Premium Groom</option>
                        <option value="luxury">Luxury Spa</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="groomingDateTime">Date and Time</label>
                    <input
                        type="datetime-local"
                        id="groomingDateTime"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)} // Prevent booking in the past
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="groomingComments">Additional Comments (Optional)</label>
                    <textarea
                        id="groomingComments"
                        rows="3"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="E.g., sensitive skin, nervous dog, etc."
                    ></textarea>
                </div>

                <button typeE="submit" className="submit-button" disabled={!selectedPetId || isLoading}>
                    {isLoading ? 'Booking...' : 'Book Grooming'}
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

export default GroomingForm;

