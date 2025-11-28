import React, { useState } from 'react';
import './AddImmunizationModal.css'; // We'll create this next

const AddImmunizationModal = ({ isOpen, onClose, onSubmit, petName }) => {
    const [formData, setFormData] = useState({
        vaccine_name: '',
        vaccine_date: new Date().toISOString().split('T')[0], // Default to today
        due_date: '',
        comments: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.vaccine_name || !formData.vaccine_date) {
            alert("Vaccine Name and Date are required.");
            return;
        }
        onSubmit(formData);
        // Reset form slightly but keep date
        setFormData(prev => ({ ...prev, vaccine_name: '', comments: '' }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>ADD RECORD: {petName}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>VACCINE / TREATMENT *</label>
                        <input
                            type="text"
                            name="vaccine_name"
                            value={formData.vaccine_name}
                            onChange={handleChange}
                            placeholder="e.g. Rabies, Bordetella"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>DATE ADMINISTERED *</label>
                            <input
                                type="date"
                                name="vaccine_date"
                                value={formData.vaccine_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label>NEXT DUE DATE (OPTIONAL)</label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>COMMENTS / NOTES</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Batch number, vet name, side effects..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>CANCEL</button>
                        <button type="submit" className="btn-submit">SAVE RECORD</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddImmunizationModal;