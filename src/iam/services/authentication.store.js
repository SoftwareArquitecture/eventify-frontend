import {AuthenticationService} from "./authentication.service.js";
import {defineStore} from "pinia";
import {SignInResponse} from "../model/sign-in.response.js";
import {SignUpResponse} from "../model/sign-up.response.js";

const authenticationService = new AuthenticationService();

/**
 * Store definition for authentication
 * @summary
 * This store is responsible to manage the authentication state.
 * It contains state for signed-in status, user ID, and username.
 * It contains actions to sign-in, sign-up, and sign-out.
 */
export const useAuthenticationStore = defineStore('authentication',{
    state: () => ({ 
        signedIn: false, 
        userId: 0, 
        username: '' 
    }),
    getters: {
        /**
         * Getter to check if user is signed in
         * @param state - Current state of the store
         * @returns {boolean} - True if user is signed in, false otherwise
         */
        isSignedIn: (state) => state['signedIn'],
        /**
         * Getter to get the current user ID
         * @param state - Current state of the store
         * @returns {number} - Current user ID
         */
        currentUserId: (state) => state['userId'],
        /**
         * Getter to get the current username
         * @param state - Current state of the store
         * @returns {string} - Current username
         */
        currentUsername: (state) => state['username'],
        /**
         * Getter to get the current token
         * @returns {string} - Current token
         */
        currentToken: () => localStorage.getItem('token')
    },
    actions: {
        /**
         * Action to initialize the store state from localStorage
         * @summary
         * This action checks if there's a token in localStorage and restores the state accordingly.
         * This is useful when the application is reloaded.
         */
        initializeAuth() {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            
            console.log('🔄 Initializing authentication state:', {
                hasToken: !!token,
                hasUserId: !!userId,
                hasUsername: !!username,
                tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
            });
            
            if (token && userId && username) {
                this.signedIn = true;
                this.userId = parseInt(userId);
                this.username = username;
                console.log('✅ Authentication state restored from localStorage');
            } else {
                console.log('⚠️ Incomplete authentication data in localStorage, staying signed out');
            }
        },
        /**
         * Action to sign-in
         * @summary
         * This action calls the sign-in API and updates the store state.
         * If sign-in is successful, it sets the signed-in status, user ID, and username.
         * It also saves the token in local storage.
         * If sign-in fails, it redirects to the sign-in page.
         * @param signInRequest - The {@link SignInRequest} object to sign-in
         * @param router - Vue router instance
         */
        async signIn(signInRequest, router) {
            try {
                console.log('🔐 Attempting sign-in for user:', signInRequest.username);
                const response = await authenticationService.signIn(signInRequest);
                let signInResponse = new SignInResponse(response.data.id, response.data.username, response.data.token);
                
                this.signedIn = true;
                this.userId = signInResponse.id;
                this.username = signInResponse.username;
                
                // Guardar en localStorage
                localStorage.setItem('token', signInResponse.token);
                localStorage.setItem('userId', signInResponse.id.toString());
                localStorage.setItem('username', signInResponse.username);
                
                console.log('✅ Sign-in successful:', {
                    userId: signInResponse.id,
                    username: signInResponse.username,
                    tokenPreview: signInResponse.token.substring(0, 20) + '...'
                });
                
                // Redirigir a Events después del login exitoso
                router.push({ name: 'Events' });
            } catch (error) {
                console.error('❌ Sign-in error:', error.response?.data || error.message);
                router.push({ name: 'sign-in' });
            }
        },
        /**
         * Action to sign-up
         * @summary
         * This action calls the sign-up API.
         * If sign-up is successful, it redirects to the sign-in page.
         * If sign-up fails, it redirects to the sign-up page.
         * @param signUpdRequest - The {@link SignUpRequest} object to sign-up
         * @param router - Vue router instance
         */
        async signUp(signUpdRequest, router) {
            try {
                console.log('📝 Attempting sign-up for user:', signUpdRequest.username);
                const response = await authenticationService.signUp(signUpdRequest);
                let signUpResponse = new SignUpResponse(response.data.message);
                router.push({ name: 'sign-in' });
                console.log('✅ Sign-up successful:', signUpResponse);
            } catch (error) {
                console.error('❌ Sign-up error:', error.response?.data || error.message);
                router.push({ name: 'sign-up' });
            }
        },
        /**
         * Action to sign-out
         * @summary
         * This action signs out the user.
         * It sets the signed-in status to false, user ID to 0, and username to empty string.
         * It also removes the token from local storage.
         * It redirects to the sign-in page.
         * @param router - Vue router instance
         */
        async signOut(router) {
            console.log('🚪 Signing out user:', this.username);
            
            this.signedIn = false;
            this.userId = 0;
            this.username = '';
            
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            
            console.log('✅ Signed out successfully');
            router.push({ name: 'sign-in' });
        }
    }
});