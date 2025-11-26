import React, { useState, useEffect, useMemo } from 'react';
// Using relative paths and .js extensions
import { getAllAppointments, updateAppointmentStatus } from '../../api/appointmentService.js';
import { getAllUsers } from '../../api/authService.js';
import { getAllPets } from '../../api/petService.js';
import { getDoctors } from '../../api/doctorService.js';
import './AdminTables.css';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Data for enrichment
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all data in parallel for speed
            const [appData, userData, petData, docData] = await Promise.all([
                getAllAppointments(),
                getAllUsers(),
                getAllPets(),
                getDoctors()
            ]);

            setAppointments(appData || []);
            setUsers(userData || []);
            setPets(petData || []);
            setDoctors(docData || []);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            alert("Could not load data. Ensure you are logged in as Admin.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Enrich the appointment data with names instead of IDs
    const enrichedAppointments = useMemo(() => {
        return (appointments || []).map(app => {
            // --- FIX IS HERE ---
            // Match using the correct 'pet_id' property from your new schema
            const pet = (pets || []).find(p => p.pet_id === app.pet_id);

            // Match using 'user_id'
            const owner = (users || []).find(u => u.user_id === app.user_id);

            // Match using 'id' (assuming doctors list still uses 'id',
            // but check if your getDoctors API returns 'id' or 'user_id')
            const doctor = (doctors || []).find(d => d.id === app.doctor_id);

            return {
                ...app,
                // Use 'pet_name' from the new schema
                petName: pet ? pet.pet_name : `Unknown Pet (${app.pet_id})`,
                ownerName: owner ? `${owner.first_name} ${owner.last_name}` : `Unknown Owner (${app.user_id})`,
                doctorName: doctor ? doctor.name : (app.booking_type === 'grooming' ? '-' : 'Unknown Doctor'),
            };
        });
    }, [appointments, users, pets, doctors]);

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            await updateAppointmentStatus(bookingId, status);
            // Optimistically update the UI
            setAppointments(prev =>
                prev.map(app => app.booking_id === bookingId ? { ...app, status } : app)
            );
        } catch (error) {
            console.error(error);
            alert(`Failed to update booking #${bookingId}`);
        }
    };

    if (isLoading) return <p>Loading appointments...</p>;

    return (
        <div className="admin-table-container">
            <h2>Manage Appointments & Grooming</h2>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Service</th>
                    <th>Owner</th>
                    <th>Pet</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {enrichedAppointments.length === 0 ? (
                    <tr><td colSpan="8" className="empty-cell">No appointments found.</td></tr>
                ) : (
                    enrichedAppointments.map(app => (
                        <tr key={app.booking_id}>
                            <td>{new Date(app.booking_date).toLocaleString()}</td>
                            <td>
                                    <span className={`type-badge ${app.booking_type}`}>
                                        {app.booking_type}
                                    </span>
                            </td>
                            <td>{app.service_type}</td>
                            <td>{app.ownerName}</td>
                            <td>{app.petName}</td>
                            <td>{app.doctorName}</td>
                            <td>
                                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                            </td>
                            <td className="actions-cell">
                                {app.status === 'Pending' && (
                                    <>
                                        <button
                                            className="action-btn approve"
                                            onClick={() => handleUpdateStatus(app.booking_id, 'Confirmed')}>
                                            ✔
                                        </button>
                                        <button
                                            className="action-btn decline"
                                            onClick={() => handleUpdateStatus(app.booking_id, 'Cancelled')}>
                                            ✖
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentManagement;