import React, { useState, useEffect } from 'react';
import { getAppointmentsByDoctorId } from '../../api/appointmentService';
import './DoctorDashboard.css';

const DoctorSchedule = ({ doctorId }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAppointmentsByDoctorId(doctorId)
            .then(data => {
                // In a real app, you'd fetch pet/user names here
                setAppointments(data);
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
                            <div key={app.id} className="appointment-card">
                                <strong>Date:</strong> {new Date(app.dateTime).toLocaleString()} <br/>
                                <strong>Pet ID:</strong> {app.petId} (Pet Name) <br/>
                                <strong>Service:</strong> {app.serviceType}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;