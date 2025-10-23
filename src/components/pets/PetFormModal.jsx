import React, { useState, useEffect } from 'react';
// Correct the CSS import path
import './PetFormModal.css';

const PetFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    // Determine if we are in "edit" mode
    const isEditMode = Boolean(initialData);

    // Set form state from initialData if editing, otherwise empty
    const [formData, setFormData] = useState({
        name: '',
        category: 'Dog',
        breed: '',
        age: '',
    });

    // When initialData changes, update the form
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                category: initialData.category || 'Dog',
                breed: initialData.breed || '',
                age: initialData.age || '',
            });
        } else {
            // Reset to empty form when in "add" mode
            setFormData({ name: '', category: 'Dog', breed: '', age: '' });
        }
    }, [initialData, isOpen]); // Re-run when modal opens

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.breed || !formData.age) {
            alert('Please fill out all fields.');
            return;
        }
        // Pass the data up to the ProfilePage
        onSubmit(formData, isEditMode ? initialData.id : null);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{isEditMode ? 'Edit Pet Details' : 'Add a New Pet'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Pet's Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange}>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="breed">Breed</label>
                        <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age (Years)</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
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