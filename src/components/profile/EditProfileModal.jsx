import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Populate form with existing user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                first_name: user.firstName || '', // Note: Redux uses camelCase
                last_name: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Pass the data back to the parent to handle the API call
        await onUpdate(formData);

        setIsSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email (Cannot be changed)</label>
                        <input type="text" value={formData.email} disabled className="disabled-input" />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label htmlFor="first_name">First Name *</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label htmlFor="last_name">Last Name *</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., (555) 123-4567"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Shipping Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street, City, State, Zip"
                            rows="3"
                        />
                        <small>Required for delivery orders.</small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;