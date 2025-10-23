import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';
import { getPetsByUserId, addPet, updatePet, removePet } from '../api/petService';
import PetList from '../components/pets/PetList';
import PetFormModal from '../components/pets/PetFormModal.jsx';
import ConfirmModal from '../components/common/ConfirmModal';

const ProfilePage = () => {
    // 1. STATE MANAGEMENT
    const { user } = useSelector((state) => state.auth);
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for which pet is currently being edited or removed
    const [selectedPet, setSelectedPet] = useState(null);

    // State for modal visibility
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    // 2. DATA FETCHING (EFFECT)
    useEffect(() => {
        // Function to load pets from the mock API
        const loadPets = async () => {
            if (user) {
                try {
                    const userPets = await getPetsByUserId(user.id);
                    setPets(userPets);
                } catch (error) {
                    console.error("Failed to load pets:", error);
                    alert("Could not load your pets. Please refresh the page.");
                }
            }
            setIsLoading(false);
        };

        loadPets();
    }, [user]); // Re-run this effect if the user object ever changes

    // 3. EVENT HANDLERS (Opening Modals)
    // These functions are passed down to PetList -> PetCard
    const handleAddNewPet = () => {
        setSelectedPet(null); // Clear any selection
        setIsAddModalOpen(true);
    };

    const handleEditPet = (pet) => {
        setSelectedPet(pet); // Set the pet to be edited
        setIsEditModalOpen(true);
    };

    const handleRemovePet = (pet) => {
        setSelectedPet(pet); // Set the pet to be removed
        setIsRemoveModalOpen(true);
    };

    // 4. API SUBMISSION HANDLERS (Handling Modal Submissions)
    const onAddSubmit = async (petData) => {
        try {
            const newPet = await addPet(petData, user.id);
            setPets([...pets, newPet]); // Add new pet to the UI
            setIsAddModalOpen(false); // Close modal
        } catch (error) {
            console.error("Failed to add pet:", error);
            alert("Could not add pet. Please try again.");
        }
    };

    const onUpdateSubmit = async (updatedData) => {
        if (!selectedPet) return;
        try {
            const updatedPet = await updatePet({ ...selectedPet, ...updatedData });
            // Update the pet in the UI by replacing the old version
            setPets(pets.map(p => p.id === updatedPet.id ? updatedPet : p));
            setIsEditModalOpen(false); // Close modal
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to update pet:", error);
            alert("Could not update pet. Please try again.");
        }
    };

    const onRemoveConfirm = async () => {
        if (!selectedPet) return;
        try {
            await removePet(selectedPet.id);
            // Update the UI by filtering out the removed pet
            setPets(pets.filter(p => p.id !== selectedPet.id));
            setIsRemoveModalOpen(false); // Close modal
            setSelectedPet(null);
        } catch (error) {
            console.error("Failed to remove pet:", error);
            alert("Could not remove pet. Please try again.");
        }
    };

    // 5. RENDER LOGIC
    const renderPetSection = () => {
        if (isLoading) {
            return <p>Loading pets...</p>;
        }

        if (pets.length === 0) {
            return (
                <div className="no-pets-view">
                    <h3>You haven't added any pets yet.</h3>
                    <p>Add your furry friends to get started!</p>
                    <button className="add-pet-button" onClick={handleAddNewPet}>
                        Add a Pet
                    </button>
                </div>
            );
        }

        return (
            <PetList
                pets={pets}
                onEdit={handleEditPet}
                onRemove={handleRemovePet}
            />
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
                        <button className="add-pet-button-small" onClick={handleAddNewPet}>
                            + Add Pet
                        </button>
                    )}
                </div>
                {renderPetSection()}
            </div>

            {/* --- MODALS --- */}
            {/* These are rendered here but only visible when their 'isOpen' prop is true */}

            {/* Add Pet Modal */}
            <PetFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={onAddSubmit}
            />

            {/* Edit Pet Modal */}
            <PetFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={onUpdateSubmit}
                initialData={selectedPet}
                isEditMode={true}
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