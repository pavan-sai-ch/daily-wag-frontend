import React, { useState } from 'react';
import './AdoptionCard.css'; // This import should now work

const AdoptionCard = ({ pet, onRequestAdoption }) => {
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequest = async () => {
        // Prevent accidental double-clicks
        if (isRequesting) return;

        // Confirm intent (optional but good UX)
        const confirm = window.confirm(`Are you sure you want to request to adopt ${pet.pet_name}?`);
        if (!confirm) return;

        setIsRequesting(true);
        // Call the parent handler
        await onRequestAdoption(pet.pet_id);
        setIsRequesting(false);
    };

    return (
        <div className="adoption-card">
            <div className="pet-image-container">
                <img
                    src={pet.photo_url || 'https://placehold.co/300x300?text=No+Image'}
                    alt={pet.pet_name}
                    className="pet-image"
                />
                <span className="pet-category-badge">{pet.pet_category}</span>
            </div>

            <div className="pet-details">
                <div className="pet-header">
                    <h3 className="pet-name">{pet.pet_name}</h3>
                    <span className="pet-age">{pet.pet_age} years old</span>
                </div>

                <p className="pet-breed">{pet.pet_breed}</p>

                {pet.medical_condition && pet.medical_condition !== 'None' && (
                    <div className="medical-info">
                        <span className="medical-label">Health:</span> {pet.medical_condition}
                    </div>
                )}

                <div className="pet-footer">
                    <button
                        className="adopt-btn"
                        onClick={handleRequest}
                        disabled={isRequesting}
                    >
                        {isRequesting ? 'Sending Request...' : '❤️ Adopt Me'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdoptionCard;