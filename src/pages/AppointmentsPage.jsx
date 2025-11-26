import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPetsByUserId } from '../api/petService';
import GroomingForm from '../components/appointments/GroomingForm';
import MedicalSection from '../components/appointments/MedicalSection';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
    // Get user and their pets
    const { user } = useSelector((state) => state.auth);
    const [userPets, setUserPets] = useState([]);

    // Check if a pet was pre-selected from another page (e.g., Profile)
    const location = useLocation();
    const preSelectedPet = location.state?.selectedPet;

    // State for the active tab and the currently selected pet
    // FIX 1: Use .pet_id instead of .id
    const [activeTab, setActiveTab] = useState('grooming');
    const [selectedPetId, setSelectedPetId] = useState(preSelectedPet ? preSelectedPet.pet_id : '');
    const [isLoadingPets, setIsLoadingPets] = useState(true);

    // Fetch the user's pets to populate the dropdown
    useEffect(() => {
        const fetchPets = async () => {
            if (user) {
                try {
                    const pets = await getPetsByUserId(user.id);
                    setUserPets(pets);
                    // If no pet was pre-selected, default to the user's first pet
                    // FIX 2: Use .pet_id here
                    if (!preSelectedPet && pets.length > 0) {
                        setSelectedPetId(pets[0].pet_id);
                    }
                } catch (error) {
                    console.error("Failed to fetch pets:", error);
                }
            }
            setIsLoadingPets(false);
        };
        fetchPets();
    }, [user, preSelectedPet]);

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h2>Book an Appointment</h2>
                <p>Select a pet and choose a service below.</p>
            </div>

            {/* --- Pet Selection Dropdown --- */}
            <div className="pet-selector-container">
                <label htmlFor="petSelector">Booking for:</label>
                <select
                    id="petSelector"
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    disabled={isLoadingPets}
                >
                    {isLoadingPets ? (
                        <option>Loading pets...</option>
                    ) : userPets.length > 0 ? (
                        <>
                            <option value="">-- Select a pet --</option>
                            {userPets.map(pet => (
                                /* FIX 3: Use .pet_id for key and value */
                                <option key={pet.pet_id} value={pet.pet_id}>
                                    {pet.pet_name} ({pet.pet_breed})
                                </option>
                            ))}
                        </>
                    ) : (
                        <option value="">Please add a pet on your profile first</option>
                    )}
                </select>
            </div>

            {/* --- Tab Navigation --- */}
            <div className="tab-navigation">
                <button
                    className={`tab-link ${activeTab === 'grooming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('grooming')}
                >
                    Grooming & General Services
                </button>
                <button
                    className={`tab-link ${activeTab === 'medical' ? 'active' : ''}`}
                    onClick={() => setActiveTab('medical')}
                >
                    Doctor & Immunizations
                </button>
            </div>

            {/* --- Tab Content --- */}
            <div className="tab-content">
                {activeTab === 'grooming' ? (
                    <GroomingForm selectedPetId={selectedPetId} />
                ) : (
                    <MedicalSection selectedPetId={selectedPetId} />
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;