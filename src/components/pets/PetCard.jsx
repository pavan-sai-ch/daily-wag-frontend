import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PetList.css'; // Ensure this CSS file exists

const PetCard = ({ pet, onEdit, onRemove }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(pet);
        setIsMenuOpen(false);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove(pet);
        setIsMenuOpen(false);
    };

    const handleSchedule = (e) => {
        e.stopPropagation();
        // Pass the selected pet to the appointments page
        navigate('/appointments', { state: { selectedPet: pet } });
        setIsMenuOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="pet-card">
            <div className="pet-card-image">
                {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.pet_name} />
                ) : (
                    <div className="pet-card-icon">🐾</div>
                )}
            </div>

            <div className="pet-card-info">
                {/* Updated to use correct DB column names */}
                <h3>{pet.pet_name}</h3>
                <p>{pet.pet_category} - {pet.pet_breed}</p>
                <p>{pet.pet_age} {parseInt(pet.pet_age) === 1 ? 'year' : 'years'} old</p>
            </div>

            {/* Kebab Menu */}
            <div className="pet-card-options" ref={menuRef}>
                <button onClick={toggleMenu} className="pet-card-options-button">
                    ⋮
                </button>

                {isMenuOpen && (
                    <div className="pet-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleSchedule}>Schedule Appointment</button>
                        <button onClick={handleEdit}>Edit Details</button>
                        <button onClick={handleRemove} className="remove">Remove Pet</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetCard;