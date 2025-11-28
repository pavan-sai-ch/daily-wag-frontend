import React, { useState, useEffect } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../api/storeService.js';
import ProductFormModal from '../store/ProductFormModal.jsx';
import './AdminTables.css';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setIsLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddClick = () => {
        setSelectedProduct(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts(prev => prev.filter(p => p.item_id !== id));
            } catch (e) { alert("Failed to delete product."); }
        }
    };

    const handleFormSubmit = async (data, id) => {
        try {
            if (isEditMode) {
                await updateProduct(id, data);
            } else {
                await addProduct(data);
            }
            fetchProducts(); // Refresh list
            setIsModalOpen(false);
        } catch (e) {
            alert("Operation failed.");
        }
    };

    if (isLoading) return <p>Loading inventory...</p>;

    return (
        <div className="admin-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Inventory Management</h2>
                <button className="action-btn approve" style={{ padding: '0.6rem' }} onClick={handleAddClick}>
                    + Add Product
                </button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(p => (
                    <tr key={p.item_id}>
                        <td>
                            <img src={p.photo_url || 'https://placehold.co/50'} alt="thumb"
                                 style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        </td>
                        <td>{p.item_name}</td>
                        <td>${p.price}</td>
                        <td>{p.stock}</td>
                        <td>
                            {p.stock > 0 ?
                                <span className="status-pill confirmed">In Stock</span> :
                                <span className="status-pill cancelled">Out of Stock</span>
                            }
                        </td>
                        <td className="actions-cell">
                            <button className="action-btn view" onClick={() => handleEditClick(p)}>Edit</button>
                            <button className="action-btn decline" onClick={() => handleDeleteClick(p.item_id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedProduct}
                isEditMode={isEditMode}
            />
        </div>
    );
};

export default InventoryManagement;