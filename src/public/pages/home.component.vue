<script>
import EventService from "../../event-management/services/event.service.js";
import dashboardService from "../../shared/services/dashboard.service.js";
import { useAuthenticationStore } from '../../iam/services/authentication.store.js';

export default {
  name: "home.component",
  data() {
    return {
      loading: true,
      stats: {
        upcomingEvents: 0,
        pendingTasks: 0,
        pendingQuotes: 0,
        completedEvents: 0
      },
      upcomingEvents: [],
      recentActivity: []
    }
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      try {
        const authStore = useAuthenticationStore();
        const userId = authStore.currentUserId;

        // Cargar estadísticas reales del backend
        const statistics = await dashboardService.getStatistics(userId);
        this.stats.upcomingEvents = statistics.upcomingEvents;
        this.stats.pendingTasks = statistics.pendingTasks;
        this.stats.pendingQuotes = statistics.pendingQuotes;
        this.stats.completedEvents = statistics.completedEvents;

        // Cargar actividad reciente real del backend
        const activities = await dashboardService.getActivity(userId);
        this.recentActivity = this.transformActivities(activities);

        // Cargar eventos próximos para mostrar en la lista
        const eventsResponse = await EventService.getEvents();
        const allEvents = eventsResponse.data || [];

        // Filtrar eventos próximos (próximos 30 días)
        const today = new Date();
        const thirtyDaysLater = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

        this.upcomingEvents = allEvents
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= thirtyDaysLater;
          })
          .slice(0, 4)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Transforma las actividades del backend al formato del frontend
     */
    transformActivities(activities) {
      if (!activities || activities.length === 0) {
        return [];
      }

      return activities.slice(0, 3).map(activity => {
        const timeAgo = this.getTimeAgo(activity.timestamp);

        return {
          type: activity.type,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          status: activity.status,
          time: timeAgo.value,
          timeUnit: timeAgo.unit,
          icon: this.getActivityIcon(activity.type),
          color: this.getActivityColor(activity.type)
        };
      });
    },

    /**
     * Calcula el tiempo transcurrido desde una fecha
     */
    getTimeAgo(timestamp) {
      const now = new Date();
      const activityDate = new Date(timestamp);
      const diffMs = now - activityDate;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return { value: diffMinutes.toString(), unit: 'minutes' };
      } else if (diffHours < 24) {
        return { value: diffHours.toString(), unit: 'hours' };
      } else {
        return { value: diffDays.toString(), unit: 'days' };
      }
    },

    /**
     * Obtiene el icono según el tipo de actividad
     */
    getActivityIcon(type) {
      const icons = {
        'event': 'pi-star',
        'quote': 'pi-dollar',
        'task': 'pi-check'
      };
      return icons[type] || 'pi-circle';
    },

    /**
     * Obtiene el color según el tipo de actividad
     */
    getActivityColor(type) {
      const colors = {
        'event': '#4ECDC4',
        'quote': '#f39c12',
        'task': '#27ae60'
      };
      return colors[type] || '#95a5a6';
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const locale = this.$i18n.locale === 'es' ? 'es-ES' : 'en-US';
      return date.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    },

    getActivityMessage(activity) {
      // Para actividades reales del backend, usar el título directamente
      return activity.title || this.$t('activity.unknownActivity');
    },

    getActivityTime(time, timeUnit) {
      const unitKey = time === '1' ? `timeUnits.${timeUnit}` : `timeUnits.${timeUnit}`;
      const unit = this.$t(unitKey);
      const timeString = `${time} ${unit}`;
      return this.$t('activity.timeAgo', { time: timeString });
    },

    getEventStatusColor(status) {
      const colors = {
        'Active': '#4ECDC4',
        'To be confirmed': '#f39c12',
        'Cancelled': '#e74c3c',
        'Completed': '#27ae60'
      };
      return colors[status] || '#4ECDC4';
    },

    navigateTo(route) {
      this.$router.push(route);
    }
  }
}
</script>

<template>
  <div class="home-container">
    <!-- Header de bienvenida más compacto -->
    <div class="welcome-section">
      <h1 class="welcome-title">{{ $t('home.welcome') }}</h1>
      <p class="welcome-subtitle">{{ $t('home.subtitle') }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-section">
      <i class="pi pi-spinner pi-spin"></i>
      <span>{{ $t('common.loading') || 'Cargando...' }}</span>
    </div>

    <!-- Dashboard content -->
    <div v-else class="dashboard-grid">
      <!-- Estadísticas principales -->
      <div class="stats-section">
        <h2 class="section-title">📊 {{ $t('home.summary') }}</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(78, 205, 196, 0.1);">
              <i class="pi pi-calendar" style="color: #4ECDC4;"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ stats.upcomingEvents }}</span>
              <span class="stat-label">{{ $t('home.upcomingEvents') }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(124, 58, 237, 0.1);">
              <i class="pi pi-check-square" style="color: #7c3aed;"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ stats.pendingTasks }}</span>
              <span class="stat-label">{{ $t('home.pendingTasks') }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(8, 145, 178, 0.1);">
              <i class="pi pi-dollar" style="color: #0891b2;"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ stats.pendingQuotes }}</span>
              <span class="stat-label">{{ $t('home.pendingQuotes') }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: rgba(39, 174, 96, 0.1);">
              <i class="pi pi-check-circle" style="color: #27ae60;"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ stats.completedEvents }}</span>
              <span class="stat-label">{{ $t('home.completedEvents') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner promocional -->
      <div class="promo-banner">
        <div class="banner-content">
          <div class="banner-text">
            <h3>{{ $t('home.promoTitle') }}</h3>
            <p>{{ $t('home.promoText') }}</p>
          </div>
          <div class="banner-image">
            <div class="banner-icon">
              <i class="pi pi-sparkles"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Eventos próximos -->
      <div class="upcoming-events">
        <h2 class="section-title">{{ $t('home.upcomingEventsTitle') }}</h2>
        <div v-if="upcomingEvents.length === 0" class="empty-state">
          <i class="pi pi-calendar"></i>
          <p>{{ $t('home.noEvents') }}</p>
          <button @click="navigateTo('/events')" class="create-event-btn">
            {{ $t('home.createFirstEvent') }}
          </button>
        </div>
        <div v-else class="events-list">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="event-item"
            @click="navigateTo('/calendar')"
          >
            <div class="event-date">
              <span class="date-text">{{ formatDate(event.date) }}</span>
            </div>
            <div class="event-info">
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-details">{{ event.customerName }} • {{ event.location }}</p>
            </div>
            <div
              class="event-status"
              :style="{ backgroundColor: getEventStatusColor(event.status) }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="recent-activity">
        <h2 class="section-title">{{ $t('home.recentActivityTitle') }}</h2>
        <div class="activity-list">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="activity-item"
          >
            <div class="activity-icon" :style="{ backgroundColor: activity.color + '20' }">
              <i :class="`pi ${activity.icon}`" :style="{ color: activity.color }"></i>
            </div>
            <div class="activity-content">
              <p class="activity-message">{{ getActivityMessage(activity) }}</p>
              <span class="activity-time">{{ getActivityTime(activity.time, activity.timeUnit) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.welcome-section {
  text-align: center;
  margin-bottom: 15px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #4ECDC4 0%, #45b7aa 100%);
  border-radius: 12px;
  color: #2c3e50;
  flex-shrink: 0;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.welcome-subtitle {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex: 1;
  color: #4ECDC4;
  font-size: 1.1rem;
}

.loading-section i {
  font-size: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto 1fr;
  gap: 15px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #ecf0f1;
}

/* Estadísticas */
.stats-section {
  grid-column: 1 / -1;
  grid-row: 1;
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: bold;
  color: #4ECDC4;
}

.stat-label {
  font-size: 0.75rem;
  color: #95a5a6;
}

/* Banner promocional horizontal */
.promo-banner {
  grid-column: 1 / -1;
  grid-row: 2;
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.9) 0%, rgba(69, 183, 170, 0.9) 100%),
              url('https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') center/cover;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px 30px;
  overflow: hidden;
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 2;
}

.banner-text h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.banner-text p {
  font-size: 0.9rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  line-height: 1.4;
}

.banner-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

/* Eventos próximos */
.upcoming-events {
  grid-column: 1 / 3;
  grid-row: 3;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.empty-state {
  text-align: center;
  padding: 15px;
  color: #95a5a6;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
}

.create-event-btn {
  background-color: #4ECDC4;
  color: #2c3e50;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.create-event-btn:hover {
  background-color: #45b7aa;
  transform: translateY(-1px);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #333;
  flex-shrink: 0;
}

.event-item:hover {
  background-color: #333;
  transform: translateX(3px);
}

.event-date {
  min-width: 50px;
  text-align: center;
}

.date-text {
  font-size: 0.7rem;
  color: #4ECDC4;
  font-weight: 600;
}

.event-info {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #ecf0f1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-details {
  font-size: 0.7rem;
  color: #95a5a6;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-status {
  width: 5px;
  height: 25px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* Actividad reciente */
.recent-activity {
  grid-column: 3;
  grid-row: 3;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #333;
  flex-shrink: 0;
}

.activity-icon {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-message {
  font-size: 0.8rem;
  color: #ecf0f1;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 0.7rem;
  color: #95a5a6;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .stats-section {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .promo-banner {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .upcoming-events {
    grid-column: 1;
    grid-row: 3;
  }

  .recent-activity {
    grid-column: 2;
    grid-row: 3;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 12px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-subtitle {
    font-size: 0.8rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 12px;
  }

  .stats-section {
    grid-column: 1;
    grid-row: 1;
  }

  .promo-banner {
    grid-column: 1;
    grid-row: 2;
    height: 100px;
    padding: 15px 20px;
  }

  .upcoming-events {
    grid-column: 1;
    grid-row: 3;
  }

  .recent-activity {
    grid-column: 1;
    grid-row: 4;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .banner-content {
    flex-direction: row;
    text-align: left;
  }

  .banner-text h3 {
    font-size: 1.1rem;
  }

  .banner-text p {
    font-size: 0.8rem;
  }
}
</style>