<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../model/sign-in.request.js";

/**
 * Sign in component
 * @summary
 * Display sign in form
 */
export default {
  name: "sign-in",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    /**
     * Sign in
     * @summary
     * Sign in user. It uses an authentication store to sign in user.
     * If sign in is successful, it redirects to the home page.
     * The store will update the current username and signed in status.
     */
    onSignIn() {
      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);
      authenticationStore.signIn(signInRequest, this.$router);
    },
    goToSignUp() {
      this.$router.push('/sign-up');
    }
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-content">
      <img src="/src/assets/eventify-logo.png" alt="Eventify" class="logo" />

      <form @submit.prevent="onSignIn" class="auth-form">
        <div class="field">
          <label for="username" class="field-label">Nombre de usuario</label>
          <pv-input-text
            id="username"
            v-model="username"
            :class="{'p-invalid': !username && username !== ''}"
            placeholder="Ingresa tu nombre de usuario"
          />
          <small v-if="!username && username !== ''" class="p-error">El nombre de usuario es requerido</small>
        </div>

        <div class="field">
          <label for="password" class="field-label">Contraseña</label>
          <pv-input-text
            id="password"
            v-model="password"
            :class="{'p-invalid': !password && password !== ''}"
            type="password"
            placeholder="Ingresa tu contraseña"
          />
          <small v-if="!password && password !== ''" class="p-error">La contraseña es requerida</small>
        </div>

        <div class="field">
          <pv-button type="submit" class="w-full">Iniciar Sesión</pv-button>
        </div>

        <div class="field text-center">
          <span class="auth-link">¿No tienes una cuenta?</span>
          <button type="button" @click="goToSignUp" class="link-btn">Regístrate</button>
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
  max-width: 400px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 30px;
  object-fit: contain;
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
}

.field {
  margin-bottom: 1.5rem;
  width: 100%;
}

.field:last-child {
  margin-bottom: 0;
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
</style>