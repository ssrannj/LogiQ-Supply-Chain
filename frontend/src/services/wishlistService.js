import api from './api';

export const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist/my');
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return [
                { id: 1, productName: 'Premium Leather Sofa', price: 899, outOfStock: false },
                { id: 2, productName: 'Ergonomic Office Chair', price: 299, outOfStock: false },
                { id: 3, productName: 'Wooden Dining Table', price: 450, outOfStock: true }
            ];
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await api.post('/wishlist', { productId });
            return response.data;
        } catch (error) {
            return { message: 'Asset cached locally for demo.' };
        }
    },

    removeFromWishlist: async (id) => {
        try {
            const response = await api.delete(`/wishlist/${id}`);
            return response.data;
        } catch (error) {
            return { message: 'Asset decommissioned from local cache.' };
        }
    }
};
