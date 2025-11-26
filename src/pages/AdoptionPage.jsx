import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAvailablePets, requestAdoption } from '../api/adoptionService';
import AdoptionCard from '../components/adoption/AdoptionCard.jsx';
import './AdoptionPage.css'; // We'll create this CSS next

const AdoptionPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pets on component mount
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const availablePets = await getAvailablePets();
                setPets(availablePets);
            } catch (err) {
                setError("Failed to load pets. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPets();
    }, []);

    const handleRequestAdoption = async (petId) => {
        // 1. Check if user is logged in
        if (!user) {
            alert("Please log in or sign up to adopt a pet!");
            return;
        }

        try {
            // 2. Send request to backend
            await requestAdoption(petId);

            alert("Adoption request submitted successfully! Our team will review it shortly.");

            // 3. Optimistically remove the pet from the list
            // (Since it's now 'pending' and no longer 'available')
            setPets(currentPets => currentPets.filter(p => p.pet_id !== petId));

        } catch (err) {
            console.error(err);
            alert("Failed to submit adoption request. Please try again.");
        }
    };

    // --- Render Logic ---

    if (isLoading) {
        return (
            <div className="adoption-container loading">
                <div className="loader"></div>
                <p>Looking for furry friends...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="adoption-container error">
                <h2>Oops!</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="adoption-container">
            <div className="adoption-header">
                <h1>Find Your Perfect Companion</h1>
                <p>These lovable pets are looking for a forever home.</p>
            </div>

            {pets.length === 0 ? (
                <div className="no-pets-message">
                    <h3>No pets available right now.</h3>
                    <p>Check back soon! We update our list daily.</p>
                </div>
            ) : (
                <div className="adoption-grid">
                    {pets.map(pet => (
                        <AdoptionCard
                            key={pet.pet_id}
                            pet={pet}
                            onRequestAdoption={handleRequestAdoption}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdoptionPage;