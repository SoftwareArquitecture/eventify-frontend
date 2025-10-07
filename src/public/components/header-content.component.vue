<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import {useAuthenticationStore} from "../../iam/services/authentication.store.js";

export default {
  name: "header-content",
  components: {LanguageSwitcher},
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      showUserMenu: false
    };
  },
  computed: {
    isSignedIn() {
      return this.authenticationStore.isSignedIn;
    },
    currentUsername() {
      return this.authenticationStore.currentUsername;
    },
    greetingMessage() {
      const hour = new Date().getHours();
      if (hour < 12) return this.$t('header.good-morning');
      if (hour < 18) return this.$t('header.good-afternoon');
      return this.$t('header.good-evening');
    },
    userInitial() {
      return this.currentUsername ? this.currentUsername.charAt(0).toUpperCase() : 'U';
    }
  },
  methods: {
    onSignOut() {
      this.authenticationStore.signOut(this.$router);
      this.showUserMenu = false;
    },
    goToProfile() {
      this.$router.push('/profiles');
      this.showUserMenu = false;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    closeUserMenu() {
      this.showUserMenu = false;
    }
  },
  mounted() {
    // Cerrar dropdown cuando se hace click fuera
    document.addEventListener('click', (e) => {
      if (!this.$refs.userMenuContainer?.contains(e.target)) {
        this.showUserMenu = false;
      }
    });
  }
}
</script>

<template>
  <div class="header-wrapper">
    <pv-toolbar class="header-toolbar">
      <template #start>
        <div class="flex align-items-center">
          <img src="../../assets/eventify-logo.png" alt="Eventify" class="logo">
        </div>
      </template>

      <template #end>
        <div class="flex align-items-center gap-3">
          <!-- Saludo personalizado -->
          <div v-if="isSignedIn" class="user-greeting">
            <span class="greeting-text">{{ greetingMessage }},</span>
            <span class="username-text">{{ currentUsername }}</span>
          </div>

          <!-- Cambio de idioma -->
          <language-switcher></language-switcher>

          <!-- Menú de usuario con dropdown -->
          <div v-if="isSignedIn" class="user-menu-container" ref="userMenuContainer">
            <button
              class="user-avatar-btn"
              @click="toggleUserMenu"
              :class="{ 'active': showUserMenu }"
            >
              {{ userInitial }}
            </button>

            <!-- Dropdown del usuario -->
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-item" @click="goToProfile">
                <i class="pi pi-user"></i>
                <span>{{ $t('header.my-profile') }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item sign-out-item" @click="onSignOut">
                <i class="pi pi-sign-out"></i>
                <span>{{ $t('header.sign-out') }}</span>
              </div>
            </div>
          </div>

          <!-- Botones de autenticación cuando no está logueado -->
          <div v-else class="auth-buttons">
            <pv-button
              :label="$t('header.sign-in')"
              icon="pi pi-sign-in"
              class="sign-in-btn"
              @click="$router.push('/sign-in')"
              text
            ></pv-button>
            <pv-button
              :label="$t('header.sign-up')"
              icon="pi pi-user-plus"
              class="sign-up-btn"
              @click="$router.push('/sign-up')"
              outlined
            ></pv-button>
          </div>
        </div>
      </template>
    </pv-toolbar>
  </div>
</template>

<style scoped>
.header-wrapper {
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-toolbar {
  background-color: #3A506B;
  border-radius: 0;
  border: none;
  padding: 0 1.5rem;
  min-height: 70px;
}

.logo {
  width: 150px;
  height: auto;
}

.user-greeting {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
}

.greeting-text {
  font-size: 12px;
  color: #e0e7ff;
  font-weight: 400;
}

.username-text {
  font-size: 14px;
  color: white;
  font-weight: 600;
}

.user-menu-container {
  position: relative;
}

.user-avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-btn:hover,
.user-avatar-btn.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #374151;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item i {
  font-size: 16px;
  color: #6b7280;
}

.sign-out-item:hover {
  background-color: #fef2f2;
}

.sign-out-item:hover i,
.sign-out-item:hover span {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.sign-in-btn {
  color: white;
}

.sign-in-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sign-up-btn {
  border-color: white;
  color: white;
}

.sign-up-btn:hover {
  background-color: white;
  color: #3A506B;
}

@media (max-width: 768px) {
  .user-greeting {
    display: none;
  }

  .header-toolbar {
    padding: 0 1rem;
  }

  .logo {
    width: 120px;
  }
}
</style>