import React, { useState } from 'react';
import './ProductCard.css'; // We'll create this CSS next

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        // Call the parent handler (which will call the API)
        await onAddToCart(product.item_id, quantity);
        setIsAdding(false);
        // Optional: Reset quantity or show a success checkmark
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                {/* Use a placeholder if no image URL is provided */}
                <img
                    src={product.photo_url || 'https://placehold.co/300x300?text=No+Image'}
                    alt={product.item_name}
                    className="product-image"
                />
            </div>

            <div className="product-details">
                <h3 className="product-name">{product.item_name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                    <span className="product-price">${Number(product.price).toFixed(2)}</span>

                    <div className="product-actions">
                        <div className="quantity-selector">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >-</button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                disabled={quantity >= product.stock}
                            >+</button>
                        </div>

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