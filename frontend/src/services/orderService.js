import api from './api';

export const orderService = {
    getTrackingStatus: async (orderId) => {
        try {
            const response = await api.get(`/customer/orders/${orderId}/tracking`);
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return {
                id: orderId || 'ORD-5542',
                status: 'PACKED',
                productName: 'Premium Leather Sofa',
                price: 899,
                estimatedDelivery: 'Oct 25, 2026',
                address: '123 Supply Chain Road, Logistics City',
                timeline: [
                    { status: 'VERIFYING', time: 'Oct 20, 2026 10:30 AM', comment: 'Payment confirmed via bank transfer' },
                    { status: 'PROCESSING', time: 'Oct 21, 2026 02:15 PM', comment: 'Order sent to warehouse for picking' },
                    { status: 'PACKED', time: 'Oct 22, 2026 09:00 AM', comment: 'Item inspected and packed for shipping' }
                ]
            };
        }
    },

    getCustomerOrders: async () => {
        const response = await api.get('/customer/orders');
        return response.data;
    }
};
