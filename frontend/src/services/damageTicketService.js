import api from './api';

export const damageTicketService = {
    createTicket: async (ticketData) => {
        const formData = new FormData();
        formData.append('orderId', ticketData.orderId);
        formData.append('productId', ticketData.productId);
        formData.append('userId', ticketData.userId);
        formData.append('description', ticketData.description);
        if (ticketData.image) {
            formData.append('image', ticketData.image);
        }

        const response = await api.post('/damage-tickets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
