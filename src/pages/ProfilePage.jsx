import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProfilePage.css';

// This is a mock API function. In a real app, this would be in an apiService.js file.
const fetchUserPets = async (userId) => {
    console.log(`Fetching pets for user ID: ${userId}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return an empty array to simulate a new user with no pets.
    // To test the other view, you can return a mock array like:
    // return [{ id: 'pet1', name: 'Buddy', breed: 'Golden Retriever' }];
    return [];
};

const ProfilePage = () => {
    // Get user data from the Redux store
    const { user } = useSelector((state) => state.auth);
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect hook to fetch data when the component loads
    useEffect(() => {
        const loadPets = async () => {
            if (user) {
                const userPets = await fetchUserPets(user.id);
                setPets(userPets);
            }
            setIsLoading(false);
        };

        loadPets();
    }, [user]); // The effect re-runs if the user object changes

    if (isLoading) {
        return <div className="profile-container"><h2>Loading Profile...</h2></div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {user.firstName}!</h1>
                <p>Manage your pets and account details here.</p>
            </div>

            <div className="pets-section">
                <h2>My Pets</h2>
                {pets.length > 0 ? (
                    <div className="pet-list">
                        {/* If the user had pets, we would map over them here to display them */}
                        {pets.map(pet => (
                            <div key={pet.id} className="pet-card-placeholder">
                                {pet.name} - {pet.breed}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-pets-view">
                        <h3>You haven't added any pets yet.</h3>
                        <p>Add your furry friends to get started!</p>
                        <button className="add-pet-button">Add a Pet</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;