import api from './api';

export const warrantyService = {
    getWarranties: async () => {
        try {
            const response = await api.get('/customer/warranties');
            return response.data;
        } catch (error) {
            // Fallback for mock demo
            return [
                { 
                    id: 'WRN-101', 
                    productName: 'Premium Leather Sofa', 
                    purchaseDate: '2024-03-20', 
                    expiryDate: '2026-03-20',
                    period: '2 Years', 
                    status: 'ACTIVE',
                    price: 899,
                    orderId: 'ORD-5542'
                },
                { 
                    id: 'WRN-102', 
                    productName: 'Wooden Dining Table', 
                    purchaseDate: '2023-01-15', 
                    expiryDate: '2024-01-15',
                    period: '1 Year', 
                    status: 'EXPIRED',
                    price: 450,
                    orderId: 'ORD-4210'
                },
                { 
                    id: 'WRN-103', 
                    productName: 'Ergonomic Office Chair', 
                    purchaseDate: '2025-01-10', 
                    expiryDate: '2026-01-10',
                    period: '1 Year', 
                    status: 'ACTIVE',
                    price: 299,
                    orderId: 'ORD-8821'
                },
                { 
                    id: 'WRN-104', 
                    productName: 'Modern Floor Lamp', 
                    purchaseDate: '2025-03-15', 
                    expiryDate: '2026-03-15',
                    period: '1 Year', 
                    status: 'ACTIVE',
                    price: 85,
                    orderId: 'ORD-9901'
                }
            ];
        }
    },

    claimSupport: async (warrantyId) => {
        const response = await api.post(`/customer/warranties/${warrantyId}/claim`);
        return response.data;
    },

    extendWarranty: async (warrantyId) => {
        const response = await api.post(`/customer/warranties/${warrantyId}/extend`);
        return response.data;
    }
};
