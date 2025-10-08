import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Interceptor to add authentication token to the request
 * @param config - Axios request configuration
 * @returns {AxiosRequestConfig} - Updated Axios request configuration
 */
export const authenticationInterceptor = (config) => {
    // Obtener el token directamente de localStorage para asegurar que siempre esté actualizado
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token added to request:', config.url, 'Token:', token.substring(0, 20) + '...');
    } else {
        console.log('⚠️ No token found in localStorage for request:', config.url);
    }
    
    return config;
}

/**
 * Response interceptor to handle authentication errors
 * @param response - Axios response
 * @returns {Promise} - Response or rejection
 */
export const responseInterceptor = (response) => {
    console.log('✅ Request successful:', response.config.url, 'Status:', response.status);
    return response;
}

/**
 * Response error interceptor to handle 401 errors
 * @param error - Axios error
 * @returns {Promise} - Rejection with error
 */
export const responseErrorInterceptor = (error) => {
    console.error('❌ Request error:', error.config?.url, 'Status:', error.response?.status);
    
    // Log detailed error information for 400 errors (validation errors)
    if (error.response && error.response.status === 400) {
        console.error('🔍 Validation Error Details:', error.response.data);
        if (error.response.data.errors) {
            console.error('📋 Specific validation errors:', error.response.data.errors);
        }
    }
    
    if (error.response && error.response.status === 401) {
        // Token expirado o inválido
        console.log('🔒 Token expired or invalid, clearing authentication and redirecting to login');
        const authenticationStore = useAuthenticationStore();
        
        // Limpiar el estado de autenticación
        authenticationStore.signedIn = false;
        authenticationStore.userId = 0;
        authenticationStore.username = '';
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        // Redirigir a login si no estamos ya ahí
        if (window.location.pathname !== '/sign-in') {
            window.location.href = '/sign-in';
        }
    }
    
    return Promise.reject(error);
}
