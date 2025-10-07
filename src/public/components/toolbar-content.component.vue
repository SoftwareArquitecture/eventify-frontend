<script>
export default {
  name: "toolbar-content",
  data() {
    return {
      menuItems: [
        {
          label: this.$t('toolbar.home'),
          route: '/home',
          icon: 'pi pi-home',
          color: '#4f46e5'
        },
        {
          label: this.$t('toolbar.profile'),
          route: '/profiles',
          icon: 'pi pi-user',
          color: '#059669'
        },
        {
          label: this.$t('toolbar.calendar'),
          route: '/calendar',
          icon: 'pi pi-calendar',
          color: '#dc2626'
        },
        {
          label: this.$t('toolbar.events'),
          route: '/events',
          icon: 'pi pi-star',
          color: '#ea580c'
        },
        {
          label: this.$t('toolbar.tasks'),
          route: '/tasks',
          icon: 'pi pi-check-square',
          color: '#7c3aed'
        },
        {
          label: this.$t('toolbar.quotes'),
          route: '/quotes',
          icon: 'pi pi-dollar',
          color: '#0891b2'
        }
      ]
    };
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    isActiveRoute(route) {
      return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
    }
  }
}
</script>

<template>
  <div class="sidebar-wrapper">
    <nav class="sidebar-nav">
      <div class="nav-items">
        <router-link
          v-for="item in menuItems"
          :key="item.route"
          :to="item.route"
          class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute(item.route) }"
        >
          <div class="nav-item-content">
            <i :class="item.icon" class="nav-icon" :style="{ color: item.color }"></i>
            <span class="nav-label">{{ item.label }}</span>
          </div>
          <div v-if="isActiveRoute(item.route)" class="active-indicator"></div>
        </router-link>
      </div>

      <!-- Espacio inferior con información adicional -->
      <div class="sidebar-footer">
        <div class="app-version">
          <i class="pi pi-info-circle"></i>
          <span>v1.0.0</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
}

.nav-items {
  flex: 1;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: none;
  color: #475569;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-item:hover {
  background-color: rgba(58, 80, 107, 0.08);
  transform: translateX(4px);
}

.nav-item-active {
  background-color: rgba(58, 80, 107, 0.1);
  color: #3A506B;
  font-weight: 600;
}

.nav-item-active:hover {
  background-color: rgba(58, 80, 107, 0.15);
}

.nav-item-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;
}

.nav-icon {
  font-size: 20px;
  margin-right: 1rem;
  min-width: 24px;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 15px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 32px;
  background-color: #3A506B;
  border-radius: 2px 0 0 2px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
}

.app-version {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 12px;
  color: #64748b;
  font-family: 'Poppins', sans-serif;
}

.app-version i {
  font-size: 14px;
}

/* Scrollbar personalizado */
.sidebar-wrapper::-webkit-scrollbar {
  width: 6px;
}

.sidebar-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.sidebar-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar-wrapper {
    width: 240px;
  }

  .nav-label {
    font-size: 14px;
  }

  .nav-icon {
    font-size: 18px;
    margin-right: 0.75rem;
  }
}

@media (max-width: 480px) {
  .sidebar-wrapper {
    width: 200px;
  }

  .nav-item-content {
    padding: 0.75rem;
  }
}
</style>
