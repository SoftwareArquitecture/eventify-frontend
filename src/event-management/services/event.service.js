import httpInstance from '../../shared/services/http.instance.js';

const EventService = {
    /**
     * Get all events
     * @param {Object} params - Optional parameters for filtering
     * @returns {Promise} Promise with the event data
     */
    async getEvents(params = {}) {
        const response = await httpInstance.get('/social-events', { params });
        // Transformar los datos del backend al formato del frontend
        if (response.data && Array.isArray(response.data)) {
            response.data = response.data.map(event => this.transformEventFromBackend(event));
        }
        return response;
    },

    /**
     * Get a specific event by its ID
     * @param {Number|String} id - Event ID
     * @returns {Promise} Promise with the event data
     */
    async getEventById(id) {
        const response = await httpInstance.get(`/social-events/${id}`);
        if (response.data) {
            response.data = this.transformEventFromBackend(response.data);
        }
        return response;
    },

    /**
     * Create a new event
     * @param {Object} eventData - Data for the new event
     * @returns {Promise} Promise with the response
     */
    createEvent(eventData) {
        return httpInstance.post('/social-events', eventData);
    },

    /**
     * Update an existing event
     * @param {Number|String} id - ID of the event to update
     * @param {Object} eventData - New data for the event
     * @returns {Promise} Promise with the response
     */
    updateEvent(id, eventData) {
        return httpInstance.put(`/social-events/${id}`, eventData);
    },

    /**
     * Eliminar un evento
     * @param {Number|String} id - ID del evento a eliminar
     * @returns {Promise} Promise con la respuesta
     */
    deleteEvent(id) {
        return httpInstance.delete(`/social-events/${id}`);
    },

    /**
     * Delete multiple events
     * @param {Array} ids - Array of event IDs to delete
     * @returns {Promise} Promise with all operations
     */
    deleteMultipleEvents(ids) {
        // Crear un array de promesas para eliminar cada evento
        const deletePromises = ids.map(id => this.deleteEvent(id));
        return Promise.all(deletePromises);
    },

    /**
     * Transform event data from backend format to frontend format
     * @param {Object} backendEvent - Event data from backend
     * @returns {Object} Event data in frontend format
     */
    transformEventFromBackend(backendEvent) {
        return {
            id: backendEvent.id,
            title: backendEvent.eventTitle || backendEvent.title,
            date: backendEvent.eventDate || backendEvent.date,
            customerName: backendEvent.customerName,
            location: backendEvent.location,
            status: this.getStatusText(backendEvent.status),
            userId: backendEvent.userId || 1
        };
    },

    /**
     * Get status text from status number
     * @param {Number} statusNumber - Status as number from backend
     * @returns {String} Status as text
     */
    getStatusText(statusNumber) {
        const statusMap = {
            0: 'Active',
            1: 'To be confirmed',
            2: 'Cancelled',
            3: 'Completed'
        };
        return statusMap[statusNumber] || 'Active';
    }
};

export default EventService;