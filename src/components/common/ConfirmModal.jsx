import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content confirm-modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="btn-danger" onClick={onConfirm}>
                        Yes, Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;