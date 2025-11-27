import React from 'react';
import ProductCard from './ProductCard.jsx';
import './ProductList.css';

const ProductList = ({ products, onAddToCart }) => {
    if (!products || products.length === 0) {
        return (
            <div className="empty-store-message">
                <h3>No products found.</h3>
                <p>Check back soon for new items!</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard
                    key={product.item_id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

export default ProductList;