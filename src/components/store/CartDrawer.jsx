import React, { useState, useEffect } from 'react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cart, onUpdateItem, onRemoveItem, onCheckout }) => {
    const [deliveryType, setDeliveryType] = useState('pickup');
    const [paymentMethod, setPaymentMethod] = useState('card');

    // --- Timer State ---
    const [countdown, setCountdown] = useState(5);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset timer if drawer closes
    useEffect(() => {
        if (!isOpen) {
            setIsTimerActive(false);
            setCountdown(5);
        }
    }, [isOpen]);

    // The Countdown Logic
    useEffect(() => {
        let timer = null;

        if (isTimerActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (isTimerActive && countdown === 0) {
            // Time is up! Trigger checkout
            setIsTimerActive(false);
            setIsProcessing(true);

            onCheckout({
                delivery_type: deliveryType,
                payment_method: paymentMethod
            }).then(() => {
                setIsProcessing(false);
                setCountdown(5);
            });
        }

        return () => clearTimeout(timer);
    }, [isTimerActive, countdown, deliveryType, paymentMethod, onCheckout]);

    if (!isOpen) return null;

    const handleButtonClick = () => {
        if (isProcessing) return;

        if (isTimerActive) {
            // CANCEL -> Stop timer
            setIsTimerActive(false);
            setCountdown(5);
        } else {
            // CHECKOUT -> Start timer
            setIsTimerActive(true);
        }
    };

    return (
        <>
            <div className="cart-overlay" onClick={onClose}></div>

            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>YOUR CART ({cart.totalItems})</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-items">
                    {cart.items.length === 0 ? (
                        <p className="empty-cart">YOUR CART IS EMPTY.</p>
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
                                        disabled={item.quantity <= 1 || isTimerActive}
                                    >-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateItem(item.item_id, item.quantity + 1)}
                                        disabled={isTimerActive}
                                    >+</button>
                                    <button
                                        className="remove-btn"
                                        onClick={() => onRemoveItem(item.item_id)}
                                        disabled={isTimerActive}
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.items.length > 0 && (
                    <div className="checkout-options">
                        <div className="option-group">
                            <label>DELIVERY METHOD</label>
                            <div className="toggle-group">
                                <button
                                    className={deliveryType === 'pickup' ? 'active' : ''}
                                    onClick={() => setDeliveryType('pickup')}
                                    disabled={isTimerActive}
                                >
                                    PICKUP
                                </button>
                                <button
                                    className={deliveryType === 'delivery' ? 'active' : ''}
                                    onClick={() => setDeliveryType('delivery')}
                                    disabled={isTimerActive}
                                >
                                    DELIVERY
                                </button>
                            </div>
                            {deliveryType === 'delivery' && (
                                <small className="delivery-note">* Shipping address required in Profile.</small>
                            )}
                        </div>

                        <div className="option-group">
                            <label>PAYMENT METHOD</label>
                            <div className="toggle-group">
                                <button
                                    className={paymentMethod === 'card' ? 'active' : ''}
                                    onClick={() => setPaymentMethod('card')}
                                    disabled={isTimerActive}
                                >
                                    CARD
                                </button>
                                <button
                                    className={paymentMethod === 'cash' ? 'active' : ''}
                                    onClick={() => setPaymentMethod('cash')}
                                    disabled={isTimerActive}
                                >
                                    CASH
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>SUBTOTAL</span>
                        <span>${Number(cart.subtotal).toFixed(2)}</span>
                    </div>

                    <button
                        className={`checkout-btn ${isTimerActive ? 'cancel-mode' : ''}`}
                        onClick={handleButtonClick}
                        disabled={cart.items.length === 0 || isProcessing}
                    >
                        {isProcessing
                            ? 'PLACING ORDER...'
                            : isTimerActive
                                ? `CANCEL (${countdown}s)`
                                : 'PROCEED TO CHECKOUT'
                        }
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;