import { getToken } from '../auth/storage';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// Get student's cart
export const getCart = async () => {
    const res = await fetch(`${API_BASE}/cart`, {
        method: 'GET',
        headers: getHeaders()
    });
    const data = await res.json();
    // Handle 404 as empty cart (not an error)
    if (res.status === 404) {
        return { cart: null };
    }
    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch cart');
    }
    return data;
};

// Add item to cart
export const addToCart = async (canteenID, foodItemID, quantity = 1) => {
    const res = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ canteenID, foodItemID, quantity })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to add to cart');
    }
    return data;
};

// Update cart item quantity
export const updateCartItem = async (foodItemID, quantity) => {
    const res = await fetch(`${API_BASE}/cart/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ foodItemID, quantity })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to update cart');
    }
    return data;
};

// Remove item from cart
export const removeFromCart = async (foodItemID) => {
    const res = await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ foodItemID })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to remove from cart');
    }
    return data;
};

// Clear entire cart
export const clearCart = async () => {
    const res = await fetch(`${API_BASE}/cart/clear`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to clear cart');
    }
    return data;
};

// Checkout cart
export const checkoutCart = async (paymentMethod, redeemPoints = 0, timeSlot = null) => {
    const res = await fetch(`${API_BASE}/cart/checkout`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ paymentMethod, redeemPoints, timeSlot })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Failed to checkout');
    }
    return data;
};
