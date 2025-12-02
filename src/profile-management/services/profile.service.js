import httpInstance from '../../shared/services/http.instance.js';

export default {
    /**
     * Fetch profile by its identifier
     * @param {number|string} profileId
     * @returns {Promise<Object>} profile resource
     */
    async getProfileById(profileId) {
        const response = await httpInstance.get(`/profiles/${profileId}`);
        return response.data;
    },

    /**
     * Create a new profile
     * @param {Object} payload
     * @returns {Promise<Object>} created profile resource
     */
    async createProfile(payload) {
        const response = await httpInstance.post(`/profiles`, payload);
        return response.data;
    },

    /**
     * Update a profile using PUT
     * @param {number|string} profileId
     * @param {Object} payload
     * @returns {Promise<Object>} updated profile resource
     */
    async updateProfile(profileId, payload) {
        const response = await httpInstance.put(`/profiles/${profileId}`, payload);
        return response.data;
    },

    /**
     * Convenience method to get profile data formatted for the profile page
     * @param {number|string} profileId
     */
    async getProfileData(profileId) {
        const profile = await this.getProfileById(profileId);
        return {
            user: {
                name: profile.fullName,
                email: profile.email,
                location: profile.streetAddress,
                title: profile.role,
                profileImage: null
            },
            statistics: {},
            certifications: { list: [] }
        };
    }
};