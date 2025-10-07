<script>
import ToolbarContent from "./public/components/toolbar-content.component.vue";
import HeaderContent from "./public/components/header-content.component.vue";

export default {
  name: "app",
  components: {HeaderContent, ToolbarContent},
  computed: {
    isAuthPage() {
      return this.$route.name === 'sign-in' || this.$route.name === 'sign-up';
    }
  }
}
</script>

<template>
  <div class="app-wrapper">
    <!-- Solo mostrar header si NO es página de autenticación -->
    <header-content v-if="!isAuthPage" />
    <div class="layout-body" :class="{ 'auth-layout': isAuthPage }">
      <!-- Solo mostrar toolbar si NO es página de autenticación -->
      <toolbar-content v-if="!isAuthPage" />
      <div class="main-content" :class="{ 'auth-main': isAuthPage }">
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
  overflow-y: auto; /* ✅ solo aquí habrá scroll si se necesita */
}

/* Main content para páginas de autenticación */
.auth-main {
  width: 100%;
  height: 100%;
}
</style>