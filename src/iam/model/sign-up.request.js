/**
 * Sign up request model
 * @summary
 * Represents a sign-up request. This is used to register a user with complete profile information.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username The username of the user.
     * @param {string} password The password of the user.
     * @param {string} firstName The first name of the user.
     * @param {string} lastName The last name of the user.
     * @param {string} email The email of the user.
     * @param {string} phoneNumber The phone number of the user.
     * @param {string} role The role of the user (organizer or service_provider).
     * @param {string} street The street address (optional).
     * @param {string} number The street number (optional).
     * @param {string} city The city (optional).
     * @param {string} postalCode The postal code (optional).
     * @param {string} country The country (optional).
     * @param {string} webSite The website URL (optional).
     * @param {string} biography The biography (optional).
     */
    constructor(username, password, firstName, lastName, email, phoneNumber, role, street = '', number = '', city = '', postalCode = '', country = '', webSite = '', biography = '') {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.street = street;
        this.number = number;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.webSite = webSite;
        this.biography = biography;
    }
}