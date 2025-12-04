<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "",
      street: "",
      number: "",
      city: "",
      postalCode: "",
      country: "",
      webSite: "",
      biography: "",
      submitted: false,
      roleOptions: [
        { label: this.$t('auth.signUp.roleOrganizer'), value: 'Organizer' },
        { label: this.$t('auth.signUp.roleHoster'), value: 'Hoster' }
      ]
    };
  },
  computed: {
    isFormValid() {
      return this.username && this.password;
    }
  },
  methods: {
    async onSignUp() {
      this.submitted = true;

      if (!this.isFormValid) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('auth.signUp.title'),
          detail: this.$t('auth.signUp.usernameRequired') + ' & ' + this.$t('auth.signUp.passwordRequired'),
          life: 3000
        });
        return;
      }

      let signUpRequest = new SignUpRequest(
        this.username,
        this.password,
        this.firstName,
        this.lastName,
        this.email,
        this.phoneNumber,
        this.role,
        this.street,
        this.number,
        this.city,
        this.postalCode,
        this.country,
        this.webSite,
        this.biography
      );

      const result = await this.authenticationStore.signUp(signUpRequest, this.$router);

      if (result.success) {
        this.$toast.add({
          severity: 'success',
          summary: this.$t('auth.signUp.title'),
          detail: this.$t('auth.signUp.successMessage'),
          life: 3000
        });
      } else {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('auth.signUp.title'),
          detail: result.message,
          life: 5000
        });
      }
    },
    goToSignIn() {
      this.$router.push('/sign-in');
    }
  }
}
</script>

<template>
  <pv-toast />
  <div class="auth-container">
    <div class="auth-content">
      <img src="/src/assets/eventify-logo.png" alt="Eventify" class="logo" />

      <form @submit.prevent="onSignUp" class="auth-form">
        <h2 class="form-title">{{ $t('auth.signUp.title') }}</h2>

        <!-- Required Fields -->
        <div class="field">
          <label for="username" class="field-label">{{ $t('auth.signUp.username') }} *</label>
          <pv-input-text
            id="username"
            v-model="username"
            :class="{'p-invalid': submitted && !username}"
            :placeholder="$t('auth.signUp.usernamePlaceholder')"
          />
          <small v-if="submitted && !username" class="p-error">{{ $t('auth.signUp.usernameRequired') }}</small>
        </div>

        <div class="field">
          <label for="password" class="field-label">{{ $t('auth.signUp.password') }} *</label>
          <pv-input-text
            id="password"
            v-model="password"
            :class="{'p-invalid': submitted && !password}"
            type="password"
            :placeholder="$t('auth.signUp.passwordPlaceholder')"
          />
          <small v-if="submitted && !password" class="p-error">{{ $t('auth.signUp.passwordRequired') }}</small>
        </div>

        <!-- Optional Fields Section -->
        <div class="form-section">
          <h3 class="section-title">{{ $t('auth.signUp.optionalFields') }}</h3>

          <div class="field-row">
            <div class="field">
              <label for="firstName" class="field-label">{{ $t('auth.signUp.firstName') }}</label>
              <pv-input-text
                id="firstName"
                v-model="firstName"
                :placeholder="$t('auth.signUp.firstNamePlaceholder')"
              />
            </div>

            <div class="field">
              <label for="lastName" class="field-label">{{ $t('auth.signUp.lastName') }}</label>
              <pv-input-text
                id="lastName"
                v-model="lastName"
                :placeholder="$t('auth.signUp.lastNamePlaceholder')"
              />
            </div>
          </div>

          <div class="field">
            <label for="email" class="field-label">{{ $t('auth.signUp.email') }}</label>
            <pv-input-text
              id="email"
              v-model="email"
              type="email"
              :placeholder="$t('auth.signUp.emailPlaceholder')"
            />
          </div>

          <div class="field">
            <label for="phoneNumber" class="field-label">{{ $t('auth.signUp.phoneNumber') }}</label>
            <pv-input-text
              id="phoneNumber"
              v-model="phoneNumber"
              :placeholder="$t('auth.signUp.phoneNumberPlaceholder')"
            />
          </div>

          <div class="field">
            <label for="role" class="field-label">{{ $t('auth.signUp.role') }}</label>
            <pv-dropdown
              id="role"
              v-model="role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('auth.signUp.rolePlaceholder')"
              class="w-full"
            />
          </div>

          <div class="field-row">
            <div class="field">
              <label for="street" class="field-label">{{ $t('auth.signUp.street') }}</label>
              <pv-input-text
                id="street"
                v-model="street"
                :placeholder="$t('auth.signUp.streetPlaceholder')"
              />
            </div>

            <div class="field">
              <label for="number" class="field-label">{{ $t('auth.signUp.number') }}</label>
              <pv-input-text
                id="number"
                v-model="number"
                :placeholder="$t('auth.signUp.numberPlaceholder')"
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="city" class="field-label">{{ $t('auth.signUp.city') }}</label>
              <pv-input-text
                id="city"
                v-model="city"
                :placeholder="$t('auth.signUp.cityPlaceholder')"
              />
            </div>

            <div class="field">
              <label for="postalCode" class="field-label">{{ $t('auth.signUp.postalCode') }}</label>
              <pv-input-text
                id="postalCode"
                v-model="postalCode"
                :placeholder="$t('auth.signUp.postalCodePlaceholder')"
              />
            </div>
          </div>

          <div class="field">
            <label for="country" class="field-label">{{ $t('auth.signUp.country') }}</label>
            <pv-input-text
              id="country"
              v-model="country"
              :placeholder="$t('auth.signUp.countryPlaceholder')"
            />
          </div>

          <div class="field">
            <label for="webSite" class="field-label">{{ $t('auth.signUp.webSite') }}</label>
            <pv-input-text
              id="webSite"
              v-model="webSite"
              type="url"
              :placeholder="$t('auth.signUp.webSitePlaceholder')"
            />
          </div>

          <div class="field">
            <label for="biography" class="field-label">{{ $t('auth.signUp.biography') }}</label>
            <pv-textarea
              id="biography"
              v-model="biography"
              :placeholder="$t('auth.signUp.biographyPlaceholder')"
              rows="3"
              class="w-full"
            />
          </div>
        </div>

        <div class="field">
          <pv-button type="submit" class="w-full">{{ $t('auth.signUp.createAccount') }}</pv-button>
        </div>

        <div class="field text-center">
          <span class="auth-link">{{ $t('auth.signUp.alreadyHaveAccount') }}</span>
          <button type="button" @click="goToSignIn" class="link-btn">{{ $t('auth.signUp.signInLink') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 700px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 30px;
  object-fit: contain;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-section {
  width: 100%;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.link-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.text-center {
  text-align: center;
}

.auth-form {
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.auth-form::-webkit-scrollbar {
  width: 8px;
}

.auth-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.auth-form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.auth-form::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.field {
  margin-bottom: 1.5rem;
  width: 100%;
}

.field:last-child {
  margin-bottom: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.p-error {
  margin-top: 0.25rem;
  display: block;
}

.w-full {
  width: 100%;
}

.auth-link {
  font-size: 14px;
  margin-right: 0.5rem;
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 14px;
}

/* Asegurar que los inputs ocupen todo el ancho */
.field .p-inputtext {
  width: 100% !important;
  box-sizing: border-box;
}

/* Asegurar que los botones ocupen todo el ancho */
.field .p-button {
  width: 100% !important;
}

/* Asegurar que el dropdown ocupe todo el ancho */
.field :deep(.p-dropdown) {
  width: 100% !important;
}

/* Asegurar que el textarea ocupe todo el ancho */
.field :deep(.p-inputtextarea) {
  width: 100% !important;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .field-row {
    grid-template-columns: 1fr;
  }

  .auth-content {
    max-width: 100%;
  }

  .auth-form {
    max-height: 60vh;
  }
}
</style>