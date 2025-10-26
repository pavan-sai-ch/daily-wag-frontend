import React from 'react';
import { useSelector } from 'react-redux';
import DoctorSchedule from '../components/doctor/DoctorSchedule';
import DoctorHours from '../components/doctor/DoctorHours';
import './DoctorDashboardPage.css';

const DoctorDashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="doctor-dashboard-container">
            <div className="dashboard-header">
                <h1>Doctor Dashboard</h1>
                <p>Welcome, Dr. {user.lastName}!</p>
            </div>

            <div className="dashboard-layout">
                {/* Component for Appointments */}
                <div className="dashboard-main">
                    <DoctorSchedule doctorId={user.id} />
                </div>

                {/* Component for Clinic Hours */}
                <div className="dashboard-sidebar">
                    <DoctorHours doctorId={user.id} />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;