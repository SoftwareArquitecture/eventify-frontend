/**
 * Sign up request model
 * @summary
 * Represents a sign-up request with required fields for user registration.
 * Required fields: username, password, email, firstName, lastName, phoneNumber, street, city, country.
 * Role defaults to 'User'. Fields number, postalCode, webSite, and biography are sent as empty strings.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username The username of the user (required).
     * @param {string} password The password of the user (required).
     * @param {string} firstName The first name of the user (required).
     * @param {string} lastName The last name of the user (required).
     * @param {string} email The email of the user (required).
     * @param {string} phoneNumber The phone number of the user (required).
     * @param {string} role The role of the user (defaults to 'User').
     * @param {string} street The street address (required).
     * @param {string} number The street number (sent as empty string).
     * @param {string} city The city (required).
     * @param {string} postalCode The postal code (sent as empty string).
     * @param {string} country The country (required).
     * @param {string} webSite The website URL (sent as empty string).
     * @param {string} biography The biography (sent as empty string).
     */
    constructor(username, password, firstName, lastName, email, phoneNumber, role = 'User', street, number = '', city, postalCode = '', country, webSite = '', biography = '') {
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