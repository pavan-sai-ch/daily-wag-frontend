import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getCart, addToCart, updateCartItem, removeFromCart, checkout } from '../api/storeService.js';
import ProductList from '../components/store/ProductList.jsx';
import CartDrawer from '../components/store/CartDrawer.jsx';
import './StorePage.css';

const StorePage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0 });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data on Load
    useEffect(() => {
        const fetchData = async () => {
            const [productsData, cartData] = await Promise.all([
                getAllProducts(),
                getCart()
            ]);
            setProducts(productsData);
            setCart(cartData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // --- Handlers ---

    const handleAddToCart = async (itemId, quantity) => {
        if (!user) {
            alert("Please log in to shop.");
            return;
        }
        try {
            await addToCart(itemId, quantity);
            const updatedCart = await getCart();
            setCart(updatedCart);
            setIsCartOpen(true);
        } catch (error) {
            alert("Failed to add item.");
        }
    };

    const handleUpdateCartItem = async (itemId, quantity) => {
        try {
            await updateCartItem(itemId, quantity);
            const updatedCart = await getCart();
            setCart(updatedCart);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveCartItem = async (itemId) => {
        try {
            await removeFromCart(itemId);
            const updatedCart = await getCart();
            setCart(updatedCart);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckout = async (checkoutOptions) => {
        try {
            await checkout(checkoutOptions);

            // --- NEW: SUCCESS FLOW ---
            // 1. Clear the cart state immediately
            setCart({ items: [], totalItems: 0, subtotal: 0 });
            setIsCartOpen(false);

            // 2. Redirect to Profile -> Orders Tab
            // We pass 'initialTab' in state so ProfilePage knows where to look
            navigate('/profile', { state: { initialTab: 'orders' } });

        } catch (error) {
            // Show backend error message (e.g. "Address required")
            alert(error.response?.data?.message || "Checkout failed.");
        }
    };

    return (
        <div className="store-container">
            <div className="store-header">
                <h1>Store</h1>
                {/*<p>Essentials for your furry friends.</p>*/}

                <button className="view-cart-btn" onClick={() => setIsCartOpen(true)}>
                    🛒 View Cart ({cart.totalItems})
                </button>
            </div>

            {isLoading ? (
                <p>Loading products...</p>
            ) : (
                <ProductList products={products} onAddToCart={handleAddToCart} />
            )}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateItem={handleUpdateCartItem}
                onRemoveItem={handleRemoveCartItem}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default StorePage;