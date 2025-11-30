import api from './api.js';

// --- Product Catalog ---

/**
 * Fetches available products from the store.
 * Supports pagination via limit/offset AND search via 'search' param.
 * @param {number} limit
 * @param {number} offset
 * @param {string} search (New)
 */
export const getAllProducts = async (limit = null, offset = 0, search = '') => {
    try {
        const params = {};
        if (limit !== null) params.limit = limit;
        if (offset !== 0) params.offset = offset;
        if (search) params.search = search;

        const response = await api.get('/products', { params });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
};

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

export const getCart = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        console.warn("Could not fetch cart (might be empty or user not logged in)");
        return { items: [], totalItems: 0, subtotal: 0 };
    }
};

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

export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`/cart/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Failed to update cart item:", error);
        throw error;
    }
};

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

export const checkout = async (checkoutData) => {
    try {
        const response = await api.post('/checkout', checkoutData);
        return response.data;
    } catch (error) {
        console.error("Checkout failed:", error);
        throw error;
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders/user');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch order history:", error);
        return [];
    }
};

// --- Admin Functions ---

export const addProduct = async (productData) => {
    try {
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