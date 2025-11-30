<script>
import ToolbarContent from "./public/components/toolbar-content.component.vue";
import HeaderContent from "./public/components/header-content.component.vue";

export default {
  name: "app",
  components: {HeaderContent, ToolbarContent},
  data() {
    return {
      showMobileMenu: false
    };
  },
  computed: {
    isAuthPage() {
      return this.$route.name === 'sign-in' || this.$route.name === 'sign-up';
    }
  },
  methods: {
    handleToggleMobileMenu(show) {
      this.showMobileMenu = show;
    },
    handleCloseMobileMenu() {
      this.showMobileMenu = false;
    }
  }
}
</script>

<template>
  <div class="app-wrapper">
    <!-- Toast global para notificaciones -->
    <pv-toast />

    <!-- Solo mostrar header si NO es página de autenticación -->
    <header-content
      v-if="!isAuthPage"
      @toggle-mobile-menu="handleToggleMobileMenu"
    />
    <div class="layout-body" :class="{ 'auth-layout': isAuthPage }">
      <!-- Solo mostrar toolbar si NO es página de autenticación -->
      <toolbar-content
        v-if="!isAuthPage"
        :showMobileMenu="showMobileMenu"
        @close-mobile-menu="handleCloseMobileMenu"
      />
      <div class="main-content" :class="{ 'auth-main': isAuthPage, 'mobile-menu-open': showMobileMenu }">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 🔒 bloquea scroll externo */
}

.layout-body {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

/* Layout para páginas de autenticación */
.auth-layout {
  justify-content: center;
  align-items: center;
}

.main-content {
  flex-grow: 1;
  overflow: hidden; /* Eliminamos el scroll vertical */
  transition: margin-left 0.3s ease;
  height: 100%; /* Aseguramos que tome todo el alto disponible */
  display: flex;
  flex-direction: column;
}

/* Main content para páginas de autenticación */
.auth-main {
  width: 100%;
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .main-content.mobile-menu-open {
    overflow: hidden; /* Prevenir scroll cuando el menú está abierto */
  }
}
</style>