import api from './api.js';

// --- Product Catalog ---

/**
 * Fetches all available products from the store.
 * @returns {Promise<Array>} List of products
 */
export const getAllProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
};

/**
 * Fetches details for a single product.
 * @param {number} id - The product ID
 */
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        throw error;
    }
};

// --- Shopping Cart ---

/**
 * Gets the current user's cart from the session.
 * @returns {Promise<object>} { items: [], totalItems: 0, subtotal: 0.00 }
 */
export const getCart = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        // If the cart is empty or doesn't exist, return a default structure
        // rather than throwing an error, to keep the UI stable.
        console.warn("Could not fetch cart (might be empty or user not logged in)");
        return { items: [], totalItems: 0, subtotal: 0 };
    }
};

/**
 * Adds an item to the cart.
 * @param {number} itemId
 * @param {number} quantity
 */
export const addToCart = async (itemId, quantity = 1) => {
    try {
        const response = await api.post('/cart', {
            item_id: itemId,
            quantity: quantity
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add to cart:", error);
        throw error;
    }
};

/**
 * Updates the quantity of an item in the cart.
 * @param {number} itemId
 * @param {number} quantity
 */
export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`/cart/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Failed to update cart item:", error);
        throw error;
    }
};

/**
 * Removes an item from the cart.
 * @param {number} itemId
 */
export const removeFromCart = async (itemId) => {
    try {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to remove item from cart:", error);
        throw error;
    }
};

// --- Checkout & Orders ---

/**
 * Processes the checkout for the current cart.
 * @param {object} checkoutData - { payment_method: 'card'|'cash', delivery_type: 'pickup'|'delivery' }
 */
export const checkout = async (checkoutData) => {
    try {
        const response = await api.post('/checkout', checkoutData);
        return response.data;
    } catch (error) {
        console.error("Checkout failed:", error);
        throw error;
    }
};

/**
 * Fetches the order history for the logged-in user.
 * @returns {Promise<Array>} List of orders
 */
export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders/user');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch order history:", error);
        return [];
    }
};

// --- Admin Functions (New) ---

export const addProduct = async (productData) => {
    try {
        // Use FormData for file upload
        const payload = new FormData();
        Object.keys(productData).forEach(key => {
            if (key !== 'imageFile') payload.append(key, productData[key]);
        });
        if (productData.imageFile) {
            payload.append('image', productData.imageFile);
        }

        const response = await api.post('/admin/products', payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Add product failed:", error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const payload = new FormData();
        Object.keys(productData).forEach(key => {
            if (key !== 'imageFile') payload.append(key, productData[key]);
        });
        if (productData.imageFile) {
            payload.append('image', productData.imageFile);
        }

        // Note: We use POST for updates to handle the file easily
        const response = await api.post(`/admin/products/${productId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Update product failed:", error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        await api.delete(`/admin/products/${productId}`);
        return true;
    } catch (error) {
        console.error("Delete product failed:", error);
        throw error;
    }
};