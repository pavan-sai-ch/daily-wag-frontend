import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PetList.css'; // This CSS file contains the dropdown styles

/**
 * PetCard Component
 * Displays a single pet's information and a dropdown menu for actions.
 *
 * @param {object} pet - The pet object to display.
 * @param {function} onEdit - Handler function from ProfilePage to trigger the edit modal.
 * @param {function} onRemove - Handler function from ProfilePage to trigger the remove modal.
 */
const PetCard = ({ pet, onEdit, onRemove }) => {
    // State to manage if the dropdown menu is open or closed
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Ref to detect clicks outside of the dropdown menu
    const menuRef = useRef(null);

    // Hook for navigation (used for "Schedule Appointment")
    const navigate = useNavigate();

    // Toggles the dropdown menu's visibility
    const toggleMenu = (e) => {
        e.stopPropagation(); // Prevents the click from being caught by the document listener
        setIsMenuOpen(!isMenuOpen);
    };

    // --- Dropdown Option Handlers ---

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(pet); // Calls the onEdit function passed from ProfilePage
        setIsMenuOpen(false); // Close menu after action
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove(pet); // Calls the onRemove function passed from ProfilePage
        setIsMenuOpen(false); // Close menu after action
    };

    const handleSchedule = (e) => {
        e.stopPropagation();
        // Navigate to the appointments page and pass the selected pet
        // so the appointments page knows which pet is being booked for.
        navigate('/appointments', { state: { selectedPet: pet } });
        setIsMenuOpen(false); // Close menu after action
    };

    // This effect adds a global click listener to close the menu
    // when the user clicks anywhere else on the page.
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the menu is open and the click was *outside* the menu...
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        // Add the listener to the whole document
        document.addEventListener('click', handleClickOutside);

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []); // Empty array ensures this effect runs only once on mount

    return (
        <div className="pet-card">
            <div className="pet-card-icon">🐾</div>
            <div className="pet-card-info">
                <h3>{pet.name}</h3>
                <p>{pet.category} - {pet.breed}</p>
                <p>{pet.age} {pet.age > 1 ? 'years' : 'year'} old</p>
            </div>

            {/* --- Kebab Button and Dropdown --- */}
            {/* We attach the ref to this container div */}
            <div className="pet-card-options" ref={menuRef}>

                {/* This button toggles the menu */}
                <button onClick={toggleMenu} className="pet-card-options-button">
                    ⋮
                </button>

                {/* The dropdown menu is conditionally rendered here */}
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