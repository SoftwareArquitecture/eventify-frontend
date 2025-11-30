import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Guard to check if user is authenticated
 * @summary
 * This guard checks if user is authenticated.
 * If user is not authenticated and tries to navigate to a route that requires authentication,
 * it redirects to the sign-in page, otherwise it allows navigation.
 * @param to - Route to navigate to
 * @param from - Route from which navigation is done
 * @param next - Function to call to navigate to the next route
 */
export const authenticationGuard = (to, from, next) => {
    const authenticationStore = useAuthenticationStore();

    // Verificar si hay token en localStorage
    const token = localStorage.getItem('token');

    if (import.meta.env.DEV) {
        console.log('🛡️ Authentication Guard:', {
            path: to.path,
            hasToken: !!token,
            storeSignedIn: authenticationStore.isSignedIn,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
        });
    }

    // Si hay token pero el store no refleja que está autenticado, restaurar el estado
    if (token && !authenticationStore.isSignedIn) {
        if (import.meta.env.DEV) console.log('🔄 Restoring authentication state from localStorage');
        authenticationStore.initializeAuth();
    }

    const isAnonymous = !token;
    const publicRoutes = ['/sign-in', '/sign-up', '/about', '/page-not-found'];
    const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);

    if (isAnonymous && routeRequiresToBeAuthenticated) {
        if (import.meta.env.DEV) console.log('🚫 User not authenticated, redirecting to sign-in');
        return next({ name: 'sign-in'});
    } else {
        if (import.meta.env.DEV) console.log('✅ Authentication check passed');
        next();
    }
}