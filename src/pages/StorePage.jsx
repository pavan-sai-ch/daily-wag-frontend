import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllProducts, getCart, addToCart, updateCartItem, removeFromCart, checkout } from '../api/storeService.js';
import ProductList from '../components/store/ProductList.jsx';
import CartDrawer from '../components/store/CartDrawer.jsx';
import './StorePage.css'; // We'll create this small layout file next

const StorePage = () => {
    const { user } = useSelector((state) => state.auth);

    // State
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
            // Refresh cart to get updated totals
            const updatedCart = await getCart();
            setCart(updatedCart);
            setIsCartOpen(true); // Open drawer to show item added
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

    const handleCheckout = async () => {
        // For now, we'll assume 'delivery' and 'card' as defaults.
        // In a real app, you'd show a checkout form modal here first.
        const confirm = window.confirm(`Ready to checkout? Total: $${cart.subtotal}`);
        if (!confirm) return;

        try {
            // NOTE: Ensure your user has an address if delivery is chosen!
            // You can add logic here to check user.address from Redux.
            await checkout({ payment_method: 'card', delivery_type: 'delivery' });
            alert("Order placed successfully!");
            setCart({ items: [], totalItems: 0, subtotal: 0 });
            setIsCartOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Checkout failed.");
        }
    };

    return (
        <div className="store-container">
            <div className="store-header">
                <h1>The Daily Wag Store</h1>
                <p>Essentials for your furry friends.</p>

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