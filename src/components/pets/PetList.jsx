import React from 'react';
import PetCard from './PetCard';
import './PetList.css';

/**
 * PetList Component: Renders a list of PetCard components.
 * * @param {object} props
 * @param {array} props.pets - The array of pet objects to display.
 * @param {function} props.onEditPet - The handler function from ProfilePage to edit a pet.
 * @param {function} props.onRemovePet - The handler function from ProfilePage to remove a pet.
 */
const PetList = ({ pets, onEditPet, onRemovePet }) => {
    return (
        <div className="pet-list-container">
            {pets.map(pet => (
                // This is the key: We pass the functions down to each card.
                // The PetCard component receives them as `onEdit` and `onRemove`.
                <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={onEditPet}
                    onRemove={onRemovePet}
                />
            ))}
        </div>
    );
};

export default PetList;