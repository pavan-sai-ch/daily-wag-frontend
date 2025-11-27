import React, { useState, useEffect } from 'react';
import { getSchedule, setSchedule } from '../../api/scheduleService.js';
import './DoctorDashboard.css'; // We'll add styles to this file

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorHours = ({ doctorId }) => {
    const [schedule, setScheduleState] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch existing schedule on load
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getSchedule(doctorId);

                // Convert the array from DB into an easy-to-use object keyed by day
                // e.g., { "Monday": { start: "09:00", end: "17:00", is_active: 1 } }
                const scheduleMap = {};
                DAYS_OF_WEEK.forEach(day => {
                    const dayData = data.find(d => d.day_of_week === day);
                    scheduleMap[day] = {
                        start: dayData ? dayData.start_time : '09:00',
                        end: dayData ? dayData.end_time : '17:00',
                        active: dayData ? Boolean(dayData.is_active) : false
                    };
                });
                setScheduleState(scheduleMap);
            } catch (error) {
                console.error("Failed to load schedule", error);
            }
            setIsLoading(false);
        };

        if (doctorId) fetchSchedule();
    }, [doctorId]);

    const handleDayChange = (day, field, value) => {
        setScheduleState(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save each day sequentially
            // In a real production app, we'd send one bulk update,
            // but our current API endpoint handles one day at a time.
            const promises = DAYS_OF_WEEK.map(day => {
                const dayData = schedule[day];
                return setSchedule({
                    day: day,
                    start: dayData.start,
                    end: dayData.end,
                    active: dayData.active,
                    doctor_id: doctorId
                });
            });

            await Promise.all(promises);
            alert("Schedule updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update schedule.");
        }
        setIsSaving(false);
    };

    if (isLoading) return <p>Loading schedule...</p>;

    return (
        <div className="dashboard-widget">
            <h3>My Clinic Hours</h3>
            <p className="widget-subtitle">Set your availability for appointments.</p>

            <div className="schedule-grid">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className={`schedule-row ${schedule[day]?.active ? 'active' : 'inactive'}`}>
                        <div className="day-label">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={schedule[day]?.active || false}
                                    onChange={(e) => handleDayChange(day, 'active', e.target.checked)}
                                />
                                {day}
                            </label>
                        </div>

                        <div className="time-inputs">
                            <input
                                type="time"
                                value={schedule[day]?.start}
                                disabled={!schedule[day]?.active}
                                onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={schedule[day]?.end}
                                disabled={!schedule[day]?.active}
                                onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="widget-footer">
                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Schedule'}
                </button>
            </div>
        </div>
    );
};

export default DoctorHours;