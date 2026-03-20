import api from './api';

export const adminService = {
    getPendingOrders: async () => {
        const response = await api.get('/admin/orders/pending-payment');
        return response.data;
    },

    verifyPayment: async (orderId, status) => {
        const response = await api.post('/admin/orders/verify-payment', { orderId, status });
        return response.data;
    },

    getSystemStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};
