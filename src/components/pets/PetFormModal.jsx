import React, { useState, useEffect } from 'react';
import './PetFormModal.css';

const PetFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        pet_name: '',
        pet_category: 'Dog',
        pet_breed: '',
        pet_age: '',
        medical_condition: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (initialData && isEditMode) {
            setFormData({
                pet_name: initialData.pet_name || '',
                pet_category: initialData.pet_category || 'Dog',
                pet_breed: initialData.pet_breed || '',
                pet_age: initialData.pet_age || '',
                medical_condition: initialData.medical_condition || ''
            });
            setPreviewUrl(initialData.photo_url || null);
        } else {
            setFormData({ pet_name: '', pet_category: 'Dog', pet_breed: '', pet_age: '', medical_condition: '' });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [initialData, isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- FILE HANDLER ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Check Size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert("File size must be less than 10MB");
                return;
            }

            // 2. Check Extension
            // Allows standard web images + RAW formats common in photography
            const fileName = file.name.toLowerCase();
            const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.heif|\.raw|\.dng|\.cr2|\.nef|\.arw)$/i;

            if (!allowedExtensions.test(fileName)) {
                alert("Invalid file type. Please upload a JPG, PNG, HEIF, or RAW image.");
                return;
            }

            setSelectedFile(file);
            // Create optimistic preview URL
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.pet_name || !formData.pet_breed || !formData.pet_age) {
            alert('Please fill out all required fields.');
            return;
        }

        // Pass data back to parent
        onSubmit({
            ...formData,
            imageFile: selectedFile,
            tempPreview: previewUrl
        }, isEditMode ? initialData.pet_id : null);

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditMode ? 'Edit Pet Details' : 'Add a New Pet'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group image-upload-section">
                        <div className="image-preview" style={{
                            backgroundImage: `url(${previewUrl || 'https://placehold.co/150x150?text=Add+Photo'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <input
                                type="file"
                                id="pet_image"
                                accept=".jpg,.jpeg,.png,.heif,.raw,.dng,.cr2,.nef,.arw"
                                onChange={handleFileChange}
                                style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                            />
                        </div>
                        <label htmlFor="pet_image" className="upload-label">
                            {previewUrl ? 'Change Photo' : 'Upload Photo'} (Max 3MB)
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_name">Pet's Name *</label>
                        <input type="text" id="pet_name" name="pet_name" value={formData.pet_name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_category">Category *</label>
                        <select id="pet_category" name="pet_category" value={formData.pet_category} onChange={handleChange}>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_breed">Breed *</label>
                        <input type="text" id="pet_breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pet_age">Age (Years) *</label>
                        <input type="number" id="pet_age" name="pet_age" value={formData.pet_age} onChange={handleChange} required min="0" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medical_condition">Medical Condition (Optional)</label>
                        <input type="text" id="medical_condition" name="medical_condition" value={formData.medical_condition} onChange={handleChange} placeholder="e.g., Healthy, Allergies..." />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">{isEditMode ? 'Save Changes' : 'Add Pet'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PetFormModal;