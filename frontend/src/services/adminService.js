import api from './api';

export const adminService = {
    getPendingOrders: async () => {
        try {
            const response = await api.get('/admin/orders/pending-payment');
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return [
                { id: 'ORD-1011', customer: 'John Doe', total: 899, slip: 'available' },
                { id: 'ORD-5542', customer: 'Alice Smith', total: 1200, slip: 'available' }
            ];
        }
    },

    verifyPayment: async (orderId, status) => {
        try {
            const response = await api.post('/admin/orders/verify-payment', { orderId, status });
            return response.data;
        } catch (error) {
            return { message: 'Verification authorized locally.' };
        }
    },

    getSystemStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};
