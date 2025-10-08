<template>
  <div v-if="visible" class="modal-overlay" @click="onCancel">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? $t('eventManagement.editEvent') : $t('eventManagement.createEvent') }}</h2>
        <button class="close-btn" @click="onCancel">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form @submit.prevent="onSaveEvent" class="modal-body">
        <div class="form-group">
          <label for="title">{{ $t('eventManagement.form.title') }}</label>
          <input
            type="text"
            id="title"
            v-model="eventData.title"
            required
            :placeholder="$t('eventManagement.form.titlePlaceholder')"
          />
        </div>

        <div class="form-group">
          <label for="date">{{ $t('eventManagement.form.date') }}</label>
          <input
            type="date"
            id="date"
            v-model="eventData.date"
            required
          />
        </div>

        <div class="form-group">
          <label for="customerName">{{ $t('eventManagement.form.customerName') }}</label>
          <input
            type="text"
            id="customerName"
            v-model="eventData.customerName"
            required
            :placeholder="$t('eventManagement.form.customerNamePlaceholder')"
          />
        </div>

        <div class="form-group">
          <label for="location">{{ $t('eventManagement.form.location') }}</label>
          <input
            type="text"
            id="location"
            v-model="eventData.location"
            required
            :placeholder="$t('eventManagement.form.locationPlaceholder')"
          />
        </div>

        <div class="form-group">
          <label for="status">{{ $t('eventManagement.form.status') }}</label>
          <select id="status" v-model="eventData.status" required>
            <option value="Active">{{ $t('eventManagement.status.active') }}</option>
            <option value="ToConfirm">{{ $t('eventManagement.status.toBeConfirmed') }}</option>
            <option value="Cancelled">{{ $t('eventManagement.status.cancelled') }}</option>
            <option value="Completed">{{ $t('eventManagement.status.completed') }}</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" @click="onCancel" class="cancel-btn">
            {{ $t('eventManagement.actions.cancel') }}
          </button>
          <button type="submit" class="save-btn" :disabled="loading">
            {{ loading ? $t('eventManagement.actions.saving') : (isEdit ? $t('eventManagement.actions.update') : $t('eventManagement.actions.create')) }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventService from '../services/event.service.js';

export default {
  name: 'EventCreateAndEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close-dialog', 'event-created', 'event-updated', 'hide'],
  data() {
    return {
      eventData: {
        title: '',
        date: '',
        customerName: '',
        location: '',
        status: 'Active',
        userId: 1
      },
      loading: false
    };
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        if (this.isEdit && this.event) {
          // Si es edición, carga los datos del evento
          this.eventData = {
            title: this.event.title || '',
            date: this.event.date ? this.formatDateForInput(this.event.date) : '',
            customerName: this.event.customerName || '',
            location: this.event.location || '',
            status: this.mapStatusToSelectValue(this.event.status) || 'Active',
            userId: this.event.userId || 1
          };
        } else {
          // Si no es edición, limpia el formulario
          this.clearForm();
        }
      }
    }
  },
  methods: {
    async onSaveEvent() {
      this.loading = true;
      try {
        // Transformar los datos al formato que espera el backend
        const eventDate = new Date(this.eventData.date);
        const isoDate = eventDate.toISOString();

        const backendPayload = {
          EventTitle: this.eventData.title,
          EventDate: isoDate,
          CustomerName: this.eventData.customerName,
          Location: this.eventData.location,
          Status: this.getStatusValue(this.eventData.status) // Enviar como número que el enum entiende
        };

        console.log('Sending payload:', backendPayload); // Para debug

        if (this.isEdit) {
          await EventService.updateEvent(this.event.id, backendPayload);
          // Emitir el evento actualizado
          const updatedEvent = {
            id: this.event.id,
            title: this.eventData.title,
            date: isoDate,
            customerName: this.eventData.customerName,
            location: this.eventData.location,
            status: this.getStatusText(this.eventData.status),
            userId: this.eventData.userId
          };
          this.$emit('event-updated', updatedEvent);
        } else {
          const response = await EventService.createEvent(backendPayload);
          // Emitir el nuevo evento creado
          const newEvent = {
            id: response.data?.id || Date.now(),
            title: this.eventData.title,
            date: isoDate,
            customerName: this.eventData.customerName,
            location: this.eventData.location,
            status: this.getStatusText(this.eventData.status),
            userId: this.eventData.userId
          };
          this.$emit('event-created', newEvent);
        }

        this.$emit('close-dialog');
        this.clearForm();
      } catch (error) {
        console.error('Error saving event:', error);
        // Mostrar el error al usuario
        alert('Error al guardar el evento. Por favor, inténtalo de nuevo.');
      } finally {
        this.loading = false;
      }
    },

    onCancel() {
      this.$emit('close-dialog');
      this.$emit('hide');
      this.clearForm();
    },

    clearForm() {
      this.eventData = {
        title: '',
        date: '',
        customerName: '',
        location: '',
        status: 'Active',
        userId: 1
      };
    },

    // Mapear los valores de status a números según el enum del backend
    getStatusValue(statusString) {
      const statusMap = {
        'Active': 0,
        'ToConfirm': 1,
        'Cancelled': 2,
        'Completed': 3
      };
      return statusMap[statusString] || 0;
    },

    // Mapear los números de status a texto para mostrar
    getStatusText(statusString) {
      const statusMap = {
        'Active': this.$t('eventManagement.status.active'),
        'ToConfirm': this.$t('eventManagement.status.toBeConfirmed'),
        'Cancelled': this.$t('eventManagement.status.cancelled'),
        'Completed': this.$t('eventManagement.status.completed')
      };
      return statusMap[statusString] || this.$t('eventManagement.status.active');
    },

    // Formatear fecha ISO para input de tipo date (YYYY-MM-DD)
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    // Mapear el texto de status del evento a los valores del select
    mapStatusToSelectValue(statusText) {
      // El statusText viene del backend ya transformado (ej: "Active", "To be confirmed")
      const statusMap = {
        'Active': 'Active',
        'To be confirmed': 'ToConfirm',
        'Cancelled': 'Cancelled',
        'Completed': 'Completed'
      };
      return statusMap[statusText] || 'Active';
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #4a5a6b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #4a5a6b;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ecf0f1;
}

.close-btn {
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #ecf0f1;
  background-color: #4a5a6b;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ecf0f1;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #4a5a6b;
  border-radius: 6px;
  background-color: #2c3e50;
  color: #ecf0f1;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #95a5a6;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #4a5a6b;
}

.cancel-btn {
  background-color: #7f8c8d;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #95a5a6;
}

.save-btn {
  background-color: #4ECDC4;
  color: #2c3e50;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: #45b7aa;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(78, 205, 196, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
