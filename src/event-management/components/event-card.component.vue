<template>
  <div class="event-card" :class="{ 'event-card-selected': selected }">
    <div class="event-header" :class="headerClass">
      <h3 class="event-title">{{ event.title }}</h3>
      <span class="event-date">{{ formattedDate }}</span>
    </div>

    <div class="event-details">
      <div class="detail-row">
        <span class="detail-label">Customer:</span>
        <span class="detail-value">{{ event.customerName }}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Place:</span>
        <span class="detail-value">{{ event.location }}</span>
      </div>

      <div class="status-row">
        <span
            class="event-status"
            :class="{
            'status-active': event.status === 'Active',
            'status-pending': event.status === 'To be confirmed',
            'status-cancelled': event.status === 'Cancelled'
          }"
        >
          {{ event.status }}
        </span>
        <button class="edit-btn" @click="$emit('edit')">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedDate() {
      if (!this.event.date) return '';

      const date = new Date(this.event.date);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    headerClass() {
      return {
        'header-active': this.event.status === 'Active',
        'header-pending': this.event.status === 'To be confirmed',
        'header-cancelled': this.event.status === 'Cancelled',
        'header-new': this.event.isNew // Clase para eventos nuevos
      };
    }
  }
};
</script>

<style scoped>
.event-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  width: 280px;
  height: 100%;
  background-color: #34495e;
  border: 1px solid #4a5a6b;
}

.event-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.event-card-selected {
  border: 2px solid #4ECDC4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.3);
}

.event-header {
  padding: 15px;
  border-bottom: 1px solid #4a5a6b;
  background-color: #2c3e50;
}

.header-active {
  background-color: #27ae60;
  color: white;
}

.header-pending {
  background-color: #f39c12;
  color: white;
}

.header-cancelled {
  background-color: #e74c3c;
  color: white;
}

.header-new {
  background-color: #4ECDC4;
  color: #2c3e50;
}

.event-title {
  margin: 0;
  font-size: 18px;
  color: #ecf0f1;
  font-weight: 600;
}

.event-date {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #bdc3c7;
}

.event-details {
  padding: 15px;
  background-color: #34495e;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  font-weight: bold;
  width: 90px;
  color: #95a5a6;
}

.detail-value {
  flex: 1;
  color: #ecf0f1;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.event-status {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background-color: #27ae60;
  color: white;
}

.status-pending {
  background-color: #f39c12;
  color: white;
}

.status-cancelled {
  background-color: #e74c3c;
  color: white;
}

.edit-btn {
  background-color: transparent;
  color: #4ECDC4;
  border: 1px solid #4ECDC4;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
}

.edit-btn:hover {
  background-color: #4ECDC4;
  color: #2c3e50;
  transform: translateY(-1px);
}
</style>