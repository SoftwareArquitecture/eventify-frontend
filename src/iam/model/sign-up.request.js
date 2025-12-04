/**
 * Sign up request model
 * @summary
 * Represents a sign-up request. Only username and password are required.
 * All other fields are optional and can be completed later in the user profile.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username The username of the user (required).
     * @param {string} password The password of the user (required).
     * @param {string} firstName The first name of the user (optional).
     * @param {string} lastName The last name of the user (optional).
     * @param {string} email The email of the user (optional).
     * @param {string} phoneNumber The phone number of the user (optional).
     * @param {string} role The role of the user (optional).
     * @param {string} street The street address (optional).
     * @param {string} number The street number (optional).
     * @param {string} city The city (optional).
     * @param {string} postalCode The postal code (optional).
     * @param {string} country The country (optional).
     * @param {string} webSite The website URL (optional).
     * @param {string} biography The biography (optional).
     */
    constructor(username, password, firstName = '', lastName = '', email = '', phoneNumber = '', role = '', street = '', number = '', city = '', postalCode = '', country = '', webSite = '', biography = '') {
        this.username = username;
        this.password = password;
        this.firstName = firstName || null;
        this.lastName = lastName || null;
        this.email = email || null;
        this.phoneNumber = phoneNumber || null;
        this.role = role || null;
        this.street = street || null;
        this.number = number || null;
        this.city = city || null;
        this.postalCode = postalCode || null;
        this.country = country || null;
        this.webSite = webSite || null;
        this.biography = biography || null;
    }
}