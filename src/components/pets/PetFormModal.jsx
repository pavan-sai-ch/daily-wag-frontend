import React, { useState, useEffect } from 'react';
import './PetFormModal.css';

const PetFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
    // State for the form fields
    const [formData, setFormData] = useState({
        pet_name: '',
        pet_category: 'Dog',
        pet_breed: '',
        pet_age: '',
        medical_condition: ''
    });

    // Populate form when editing
    useEffect(() => {
        if (initialData && isEditMode) {
            // Map backend data to form state
            setFormData({
                pet_name: initialData.pet_name || '',
                pet_category: initialData.pet_category || 'Dog',
                pet_breed: initialData.pet_breed || '',
                pet_age: initialData.pet_age || '',
                medical_condition: initialData.medical_condition || ''
            });
        } else {
            // Reset to empty form when in "add" mode
            setFormData({
                pet_name: '',
                pet_category: 'Dog',
                pet_breed: '',
                pet_age: '',
                medical_condition: ''
            });
        }
    }, [initialData, isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.pet_name || !formData.pet_breed || !formData.pet_age) {
            alert('Please fill out all required fields.');
            return;
        }

        // Pass the data up to ProfilePage
        // The keys here (pet_name, etc.) already match what the PHP Controller expects
        onSubmit(formData, isEditMode ? initialData.pet_id : null);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditMode ? 'Edit Pet Details' : 'Add a New Pet'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="pet_name">Pet's Name *</label>
                        <input
                            type="text"
                            id="pet_name"
                            name="pet_name"
                            value={formData.pet_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_category">Category *</label>
                        <select
                            id="pet_category"
                            name="pet_category"
                            value={formData.pet_category}
                            onChange={handleChange}
                        >
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_breed">Breed *</label>
                        <input
                            type="text"
                            id="pet_breed"
                            name="pet_breed"
                            value={formData.pet_breed}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_age">Age (Years) *</label>
                        <input
                            type="number"
                            id="pet_age"
                            name="pet_age"
                            value={formData.pet_age}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medical_condition">Medical Condition (Optional)</label>
                        <input
                            type="text"
                            id="medical_condition"
                            name="medical_condition"
                            value={formData.medical_condition}
                            onChange={handleChange}
                            placeholder="e.g., Healthy, Allergies, etc."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? 'Save Changes' : 'Add Pet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PetFormModal;