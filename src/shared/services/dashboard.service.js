import httpInstance from './http.instance.js';

/**
 * Dashboard Service
 * Servicio para obtener estadísticas y actividad reciente del dashboard
 */
export default {
    /**
     * Obtiene las estadísticas del organizador para el dashboard
     * @param {number} organizerId - ID del organizador (userId)
     * @returns {Promise<Object>} Estadísticas del dashboard
     * @example
     * Response: {
     *   pendingTasks: 1,
     *   pendingQuotes: 1,
     *   upcomingEvents: 2,
     *   completedEvents: 0
     * }
     */
    async getStatistics(organizerId) {
        try {
            console.log(`📊 Fetching dashboard statistics for organizer: ${organizerId}`);
            const response = await httpInstance.get(`/dashboard/statistics/organizers/${organizerId}`);
            console.log('✅ Dashboard statistics loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching dashboard statistics:', error);
            throw error;
        }
    },

    /**
     * Obtiene la actividad reciente del organizador
     * @param {number} organizerId - ID del organizador (userId)
     * @returns {Promise<Array>} Array de actividades recientes
     * @example
     * Response: [
     *   {
     *     type: "event",
     *     title: "Evento 1",
     *     description: "Evento en Lima",
     *     timestamp: "2024-01-15T10:30:00",
     *     status: "Active"
     *   }
     * ]
     */
    async getActivity(organizerId) {
        try {
            console.log(`📋 Fetching recent activity for organizer: ${organizerId}`);
            const response = await httpInstance.get(`/dashboard/activity/organizers/${organizerId}`);
            console.log('✅ Recent activity loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching recent activity:', error);
            throw error;
        }
    }
};
