import httpInstance from './http.instance.js';

export default {
    /**
     * Obtiene todos los datos del perfil de un usuario
     * @param {number} profileId Identificador del perfil
     * @returns {Promise<Object>} Datos del perfil junto a estadísticas y certificaciones
     */
    async getProfileData(profileId = 1) {
        try {
            console.log(`📊 Fetching profile with ID: ${profileId}`);
            console.log(`🔑 Token in localStorage: ${localStorage.getItem('token') ? 'YES' : 'NO'}`);

            const response = await httpInstance.get(`/profiles/${profileId}`);
            const profile = response.data;

            console.log('✅ Profile data loaded successfully:', profile);

            return {
                user: {
                    name: profile.fullName || '',
                    email: profile.email || '',
                    location: profile.streetAddress || '',
                    title: profile.role || '',
                    phone: profile.phoneNumber || '',
                    website: profile.website || '',
                    bio: profile.bio || '',
                    profileImage: profile.profileImage || null
                },
                statistics: {
                    completedEvents: 0,
                    sentQuotes: 0,
                    servedCustomers: 0,
                    averageRating: 0
                },
                certifications: { list: [] }
            };
        } catch (error) {
            console.error('❌ Error fetching profile data:', error);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error message:', error.response?.data);
            throw error;
        }
    }
};