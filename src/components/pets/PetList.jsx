import React from 'react';
import PetCard from './PetCard';
import './PetList.css';

const PetList = ({ pets }) => {
    return (
        <div className="pet-list-container">
            {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
            ))}
        </div>
    );
};

export default PetList;