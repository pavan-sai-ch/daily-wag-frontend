import React, { useState, useEffect } from 'react';
// Reuse the modal CSS from pets as it fits the style
import './ProductFormModal.css';

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        item_name: '',
        description: '',
        price: '',
        stock: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (initialData && isEditMode) {
            setFormData({
                item_name: initialData.item_name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                stock: initialData.stock || ''
            });
            setPreviewUrl(initialData.photo_url || null);
        } else {
            setFormData({ item_name: '', description: '', price: '', stock: '' });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [initialData, isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            imageFile: selectedFile
        }, isEditMode ? initialData.item_id : null);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="form-group image-upload-section">
                        <div className="image-preview" style={{
                            backgroundImage: `url(${previewUrl || 'https://placehold.co/150x150?text=Product'})`,
                            backgroundSize: 'cover'
                        }}>
                            <input type="file" accept="image/*" onChange={handleFileChange}
                                   style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                        </div>
                        <label className="upload-label">{previewUrl ? 'Change Photo' : 'Upload Photo'}</label>
                    </div>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="item_name" value={formData.item_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
                        </div>
                        <div className="form-group half">
                            <label>Stock Quantity</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;