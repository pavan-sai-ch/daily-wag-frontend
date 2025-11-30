import React, { useState, useEffect } from 'react';
import { getAppointmentsByDoctorId, updateAppointmentStatus } from '../../api/appointmentService.js';
import './DoctorDashboard.css';

const DoctorSchedule = ({ doctorId }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchedule = () => {
        getAppointmentsByDoctorId()
            .then(data => {
                setAppointments(data || []);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        // doctorId is managed by session backend, but we trigger re-fetch if prop changes
        fetchSchedule();
    }, [doctorId]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            // Reuse the update status API (now allows doctors to cancel their own)
            await updateAppointmentStatus(bookingId, 'Cancelled');
            alert("Appointment cancelled.");
            fetchSchedule(); // Refresh list
        } catch (error) {
            alert("Failed to cancel appointment.");
        }
    };

    return (
        <div className="dashboard-widget">
            <h3>Upcoming Appointments</h3>
            {isLoading ? <p>Loading schedule...</p> : (
                <div className="appointment-list">
                    {appointments.length === 0 ? <p>No appointments found.</p> : (
                        appointments.map(app => (
                            <div key={app.booking_id} className="appointment-card">
                                <div className="card-header">
                                    <span className="app-date">
                                        {new Date(app.booking_date).toLocaleString()}
                                    </span>
                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="card-details">
                                    <strong>Patient:</strong> {app.pet_name} ({app.pet_breed}) <br/>
                                    <strong>Owner:</strong> {app.owner_first_name} {app.owner_last_name} <br/>
                                    <strong>Service:</strong> {app.service_type}
                                </div>

                                {/* Only show Cancel if not already cancelled/completed */}
                                {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                        <button
                                            className="cancel-button"
                                            style={{
                                                background: 'transparent',
                                                color: '#d93025',
                                                border: '1px solid #d93025',
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontFamily: 'Courier New, monospace',
                                                textTransform: 'uppercase',
                                                fontSize: '0.8rem'
                                            }}
                                            onClick={() => handleCancel(app.booking_id)}
                                        >
                                            CANCEL APPOINTMENT
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;