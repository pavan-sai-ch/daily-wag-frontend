import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await onAddToCart(product.item_id, quantity);
        setIsAdding(false);
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.photo_url || 'https://placehold.co/300x300?text=No+Image'}
                    alt={product.item_name}
                    className="product-image"
                />
                {/* --- NEW: Overlay Description --- */}
                <div className="product-overlay">
                    <p className="overlay-description">{product.description}</p>
                </div>
            </div>

            <div className="product-details">
                <h3 className="product-name">{product.item_name}</h3>

                {/* Removed description from here since it's now in the overlay */}

                <div className="product-footer">
                    <span className="product-price">${Number(product.price).toFixed(2)}</span>

                    <div className="product-actions">
                        <button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                        >
                            {product.stock === 0 ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;