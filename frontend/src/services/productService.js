import api from './api';

const productService = {
    searchProducts: async (keyword) => {
        try {
            const response = await api.get(`/products/search?keyword=${keyword}`);
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            const response = await api.get('/products');
            return response.data.content; // Response is a Page, return items list
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
};

export default productService;
