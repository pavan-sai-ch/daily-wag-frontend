import React, { useState, useEffect, useMemo } from 'react';
import { getAllAppointments, updateAppointmentStatus } from '../../api/appointmentService';
import { getAllUsers } from '../../api/authService';
import { getAllPets } from '../../api/petService';
import { getDoctors } from '../../api/doctorService';
import './AdminTables.css'; // New CSS file

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // We need to fetch all data sources to "enrich" the appointments
    const [users, setUsers] = useState([]);
    const [pets, setPets] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all data in parallel
            const [appData, userData, petData, docData] = await Promise.all([
                getAllAppointments(),
                getAllUsers(),
                getAllPets(),
                getDoctors() // This is sync, but we treat it as async for consistency
            ]);

            setAppointments(appData);
            setUsers(userData);
            setPets(petData);
            setDoctors(docData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            alert("Could not load data.");
        }
        setIsLoading(false);
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // This is the "Data Enrichment" logic.
    // useMemo ensures this only re-runs if the source data changes.
    const enrichedAppointments = useMemo(() => {
        return appointments.map(app => {
            const pet = pets.find(p => p.id === app.petId);
            const owner = users.find(u => u.id === pet?.userId);
            const doctor = doctors.find(d => d.id === app.doctorId);

            return {
                ...app,
                petName: pet ? pet.name : 'Unknown Pet',
                ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner',
                doctorName: doctor ? `Dr. ${doctor.lastName}` : 'Unknown Doctor',
            };
        });
    }, [appointments, users, pets, doctors]);

    // --- Action Handlers ---
    const handleUpdateStatus = async (appId, status) => {
        try {
            await updateAppointmentStatus(appId, status);
            // Refresh the list to show the change
            setAppointments(prevApps =>
                prevApps.map(app => app.id === appId ? { ...app, status } : app)
            );
        } catch (error) {
            alert(`Failed to ${status} appointment.`);
        }
    };

    if (isLoading) {
        return <p>Loading appointments...</p>;
    }

    return (
        <div className="admin-table-container">
            <h2>Manage All Appointments</h2>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Owner</th>
                    <th>Pet</th>
                    <th>Doctor</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {enrichedAppointments.map(app => (
                    <tr key={app.id}>
                        <td>{app.ownerName}</td>
                        <td>{app.petName}</td>
                        <td>{app.doctorName}</td>
                        <td>{app.serviceType}</td>
                        <td>{new Date(app.dateTime).toLocaleString()}</td>
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
                                        onClick={() => handleUpdateStatus(app.id, 'Confirmed')}>
                                        Approve
                                    </button>
                                    <button
                                        className="action-btn decline"
                                        onClick={() => handleUpdateStatus(app.id, 'Cancelled')}>
                                        Decline
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentManagement;