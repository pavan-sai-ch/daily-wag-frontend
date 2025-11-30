import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getCart, addToCart, updateCartItem, removeFromCart, checkout } from '../api/storeService.js';
import ProductList from '../components/store/ProductList.jsx';
import CartDrawer from '../components/store/CartDrawer.jsx';
import './StorePage.css';

const ITEMS_PER_PAGE = 12;

const StorePage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0 });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Loading States
    const [isLoading, setIsLoading] = useState(true); // Initial load
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Scroll load
    const [hasMore, setHasMore] = useState(true); // Are there more items?
    const [offset, setOffset] = useState(0);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const observer = useRef();

    // --- Infinite Scroll Observer ---
    const lastProductElementRef = useCallback(node => {
        if (isLoading || isLoadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prevOffset => prevOffset + ITEMS_PER_PAGE);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isLoadingMore, hasMore]);

    // --- Fetch Data Effect ---
    useEffect(() => {
        const fetchProducts = async () => {
            const isInitial = offset === 0;
            if (isInitial) setIsLoading(true);
            else setIsLoadingMore(true);

            try {
                // Load Cart only once
                if (isInitial && !searchTerm) {
                    getCart().then(setCart).catch(() => {});
                }

                // Fetch with Search Term using server-side filtering
                const newProducts = await getAllProducts(ITEMS_PER_PAGE, offset, searchTerm);

                setProducts(prev => {
                    return isInitial ? newProducts : [...prev, ...newProducts];
                });

                setHasMore(newProducts.length === ITEMS_PER_PAGE);

            } catch (error) {
                console.error("Failed to load store data", error);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        };

        // Debounce logic for search
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timer);

    }, [offset, searchTerm]);

    // --- Reset Offset on Search Change ---
    useEffect(() => {
        setOffset(0);
        setHasMore(true);
    }, [searchTerm]);


    // ... (Handlers) ...
    const handleAddToCart = async (itemId, quantity) => {
        if (!user) { alert("Please log in."); return; }
        try { await addToCart(itemId, quantity); setCart(await getCart()); setIsCartOpen(true); }
        catch (e) { alert("Failed."); }
    };
    const handleUpdateCartItem = async (id, qty) => { await updateCartItem(id, qty); setCart(await getCart()); };
    const handleRemoveCartItem = async (id) => { await removeFromCart(id); setCart(await getCart()); };
    const handleCheckout = async (opts) => {
        try { await checkout(opts); setCart({items:[], totalItems:0}); setIsCartOpen(false); navigate('/profile', {state:{initialTab:'orders'}}); }
        catch (e) { alert(e.response?.data?.message); }
    };

    return (
        <div className="store-container">
            <div className="store-header">
                <div className="header-content">
                    <h1>THE STORE</h1>
                    <p>ESSENTIALS.</p>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="SEARCH PRODUCTS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="view-cart-btn" onClick={() => setIsCartOpen(true)}>
                    CART ({cart.totalItems})
                </button>
            </div>

            {isLoading && offset === 0 ? (
                <p style={{textAlign:'center', padding:'4rem'}}>LOADING INVENTORY...</p>
            ) : (
                <>
                    <ProductList products={products} onAddToCart={handleAddToCart} />

                    {hasMore && (
                        <div ref={lastProductElementRef} style={{ height: '20px', margin: '20px 0', textAlign: 'center' }}>
                            {isLoadingMore && 'Loading more items...'}
                        </div>
                    )}

                    {!hasMore && products.length > 0 && (
                        <p style={{ textAlign: 'center', color: '#999', fontFamily: 'Courier New, monospace', marginTop: '2rem' }}>END OF COLLECTION.</p>
                    )}

                    {!hasMore && products.length === 0 && !isLoading && (
                        <p style={{ textAlign: 'center', padding: '4rem' }}>NO PRODUCTS FOUND.</p>
                    )}
                </>
            )}

            <CartDrawer
                isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart}
                onUpdateItem={handleUpdateCartItem} onRemoveItem={handleRemoveCartItem} onCheckout={handleCheckout}
            />
        </div>
    );
};

export default StorePage;