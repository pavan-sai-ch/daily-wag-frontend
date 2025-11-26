import React from 'react';
import './CartDrawer.css'; // This import should now work

const CartDrawer = ({ isOpen, onClose, cart, onUpdateItem, onRemoveItem, onCheckout }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay to close drawer when clicking outside */}
            <div className="cart-overlay" onClick={onClose}></div>

            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>Your Cart ({cart.totalItems})</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {cart.items.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        cart.items.map(item => (
                            <div key={item.item_id} className="cart-item">
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <p>${Number(item.price).toFixed(2)}</p>
                                </div>
                                <div className="item-controls">
                                    <button
                                        onClick={() => onUpdateItem(item.item_id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateItem(item.item_id, item.quantity + 1)}
                                    >+</button>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemoveItem(item.item_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Subtotal:</span>
                        <span>${Number(cart.subtotal).toFixed(2)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={onCheckout}
                        disabled={cart.items.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;