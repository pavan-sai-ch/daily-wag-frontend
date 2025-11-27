import React, { useState, useEffect } from 'react';
import { getAppointmentsByDoctorId } from '../../api/appointmentService.js'; // Ensure .js extension
import './DoctorDashboard.css';

const DoctorSchedule = ({ doctorId }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // The doctorId is actually handled by the session on the backend,
        // but we trigger the fetch here.
        getAppointmentsByDoctorId()
            .then(data => {
                setAppointments(data || []);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [doctorId]);

    return (
        <div className="dashboard-widget">
            <h3>Upcoming Appointments</h3>
            {isLoading ? <p>Loading schedule...</p> : (
                <div className="appointment-list">
                    {appointments.length === 0 ? <p>No appointments found.</p> : (
                        appointments.map(app => (
                            // FIX: Use 'booking_id' (database column) instead of 'id'
                            <div key={app.booking_id} className="appointment-card">
                                <div className="card-header">
                                    <span className="app-date">
                                        {new Date(app.booking_date).toLocaleString()}
                                    </span>
                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </div>

                                {/* Update property names to match DB (snake_case) */}
                                <div className="card-details">
                                    <strong>Patient:</strong> {app.pet_name} ({app.pet_breed}) <br/>
                                    <strong>Owner:</strong> {app.owner_first_name} {app.owner_last_name} <br/>
                                    <strong>Service:</strong> {app.service_type}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;