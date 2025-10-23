import React from 'react';
import './PetList.css';

const PetCard = ({ pet }) => {
    return (
        <div className="pet-card">
            <div className="pet-card-icon">🐾</div>
            <div className="pet-card-info">
                <h3>{pet.name}</h3>
                <p>{pet.category} - {pet.breed}</p>
                <p>{pet.age} {pet.age > 1 ? 'years' : 'year'} old</p>
            </div>
            <button className="pet-card-options">⋮</button>
        </div>
    );
};

export default PetCard;