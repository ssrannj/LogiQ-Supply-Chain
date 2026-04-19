import axios from 'axios';

const API_URL = 'http://localhost:8081/api/damage-tickets';

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

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
