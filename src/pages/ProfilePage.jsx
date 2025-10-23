import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';
import { getPetsByUserId, addPet, updatePet, removePet } from '../api/petService';
import PetList from '../components/pets/PetList';
import PetFormModal from '../components/pets/PetFormModal';
import ConfirmModal from '../components/common/ConfirmModal';

const ProfilePage = () => {
    // Get user data from the Redux store
    const { user } = useSelector((state) => state.auth);

    // State for pets
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    // State to track which pet is being edited or removed
    const [selectedPet, setSelectedPet] = useState(null);

    // Fetch user's pets when the component loads
    useEffect(() => {
        const loadPets = async () => {
            if (user) {
                try {
                    const userPets = await getPetsByUserId(user.id);
                    setPets(userPets);
                } catch (error) {
                    console.error("Failed to load pets:", error);
                    alert("Could not load your pets. Please try again.");
                }
            }
            setIsLoading(false);
        };

        loadPets();
    }, [user]); // The effect re-runs if the user object changes

    // --- Modal "Open" Handlers ---

    const handleAddPetClick = () => {
        setIsAddModalOpen(true);
    };

    const handleEditPet = (pet) => {
        setSelectedPet(pet);
        setIsEditModalOpen(true);
    };

    const handleRemovePet = (pet) => {
        setSelectedPet(pet);
        setIsRemoveModalOpen(true);
    };

    // --- Modal "Submit" Handlers ---

    // Called from PetFormModal when in "Add" mode
    const onAddSubmit = async (petData) => {
        setIsLoading(true);
        try {
            const newPet = await addPet(petData, user.id);
            setPets([...pets, newPet]); // Add new pet to the local state
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to add pet:", error);
            alert("Could not add pet. Please try again.");
        }
        setIsLoading(false);
    };

    // Called from PetFormModal when in "Edit" mode
    const onUpdateSubmit = async (updatedData) => {
        setIsLoading(true);
        try {
            // Combine old pet data (like ID) with new form data
            const petToUpdate = { ...selectedPet, ...updatedData };
            const updatedPet = await updatePet(petToUpdate);

            // Update the pet in the local state
            setPets(pets.map(p => p.id === updatedPet.id ? updatedPet : p));
            setIsEditModalOpen(false);
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to update pet:", error);
            alert("Could not update pet. Please try again.");
        }
        setIsLoading(false);
    };

    // Called from ConfirmModal
    const onRemoveConfirm = async () => {
        setIsLoading(true);
        try {
            await removePet(selectedPet.id);
            // Remove the pet from the local state
            setPets(pets.filter(p => p.id !== selectedPet.id));
            setIsRemoveModalOpen(false);
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to remove pet:", error);
            alert("Could not remove pet. Please try again.");
        }
        setIsLoading(false);
    };

    // --- Render Logic ---

    const renderPetSection = () => {
        if (isLoading) {
            return <p>Loading pets...</p>;
        }

        if (pets.length > 0) {
            // This is the corrected part:
            // We pass the handler functions down to PetList
            return (
                <PetList
                    pets={pets}
                    onEditPet={handleEditPet}
                    onRemovePet={handleRemovePet}
                />
            );
        }

        return (
            <div className="no-pets-view">
                <h3>You haven't added any pets yet.</h3>
                <p>Add your furry friends to get started!</p>
                <button className="add-pet-button" onClick={handleAddPetClick}>
                    Add a Pet
                </button>
            </div>
        );
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {user.firstName}!</h1>
                <p>Manage your pets and account details here.</p>
            </div>

            <div className="pets-section">
                <div className="pets-section-header">
                    <h2>My Pets</h2>
                    {/* Show "Add Pet" button in header if user already has pets */}
                    {pets.length > 0 && !isLoading && (
                        <button className="add-pet-button-small" onClick={handleAddPetClick}>
                            + Add Pet
                        </button>
                    )}
                </div>
                {renderPetSection()}
            </div>

            {/* --- Modals --- */}

            {/* Add Pet Modal */}
            <PetFormModal
                mode="add"
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={onAddSubmit}
            />

            {/* Edit Pet Modal */}
            <PetFormModal
                mode="edit"
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={onUpdateSubmit}
                initialData={selectedPet}
            />

            {/* Remove Pet Confirmation Modal */}
            <ConfirmModal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={onRemoveConfirm}
                title="Remove Pet"
                message={`Are you sure you want to remove ${selectedPet?.name}? This action cannot be undone.`}
            />
        </div>
    );
};

export default ProfilePage;