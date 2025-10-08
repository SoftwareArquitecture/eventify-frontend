<script>
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventService from "../../event-management/services/event.service.js";
import EventCreateAndEditDialog from "../../event-management/components/event-create-and-edit-dialog.component.vue";
import FullCalendar from '@fullcalendar/vue3';

export default {
  name: "event-calendar",
  components: {
    EventCreateAndEditDialog,
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialDate: '2025-10-01', // Forzar a octubre 2025
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events: [], // Los eventos se asignarán dinámicamente
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventDrop: this.handleEventDrop,
        height: '100%', // Usar toda la altura disponible del contenedor flex
        aspectRatio: null, // Eliminar aspect ratio para usar altura fija
        expandRows: true, // Permitir que las filas se expandan
        locale: 'es',
        buttonText: {
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          prev: 'Anterior',
          next: 'Siguiente'
        },
        moreLinkText: 'más eventos',
        noEventsText: 'No hay eventos para mostrar',
        eventDisplay: 'block',
        displayEventTime: false,
        // Forzar renderizado de eventos
        eventDidMount: (info) => {
          console.log('🎨 Event mounted:', info.event.title, 'on', info.event.startStr);
        }
      },
      loading: false,
      // Modal state
      createEventVisible: false,
      selectedEvent: null,
      isEdit: false,
      selectedDate: null
    }
  },

  async mounted() {
    await this.loadEvents();
  },

  methods: {
    async loadEvents() {
      this.loading = true;
      try {
        const response = await EventService.getEvents();
        console.log("🔍 Raw events from service:", response.data);

        const processedEvents = response.data.map(event => {
          console.log("🔧 Processing event:", event);

          // Asegurar que la fecha esté en formato correcto
          let eventDate = event.date;
          if (eventDate && eventDate.includes('T')) {
            eventDate = eventDate.split('T')[0];
          }
          console.log("📅 Event date formatted:", eventDate);

          const calendarEvent = {
            id: event.id,
            title: event.title,
            start: eventDate,
            allDay: true,
            display: 'block', // Forzar visualización como bloque
            backgroundColor: this.getEventColor(event.status),
            borderColor: this.getEventColor(event.status),
            textColor: '#ffffff',
            extendedProps: {
              customerName: event.customerName,
              location: event.location,
              status: event.status,
              originalEvent: event
            }
          };

          console.log("✅ Calendar event created:", calendarEvent);
          return calendarEvent;
        });

        // Asignar eventos directamente a las opciones del calendario
        this.calendarOptions.events = processedEvents;

        console.log("🎯 Final events assigned to calendar:", processedEvents);
        console.log("📊 Total events loaded:", processedEvents.length);

        // Forzar re-renderizado del calendario
        this.$nextTick(() => {
          this.forceCalendarRefresh();
        });

      } catch (error) {
        console.error("❌ Error al cargar eventos:", error);
      } finally {
        this.loading = false;
      }
    },

    forceCalendarRefresh() {
      // Intentar obtener la referencia del calendario y forzar actualización
      const calendarApi = this.$refs.fullCalendar?.getApi();
      if (calendarApi) {
        calendarApi.refetchEvents();
        console.log("🔄 Calendar refreshed");
      }
    },

    getEventColor(status) {
      const colors = {
        'Active': '#4ECDC4',
        'Activo': '#4ECDC4',
        'To be confirmed': '#f39c12',
        'Por confirmar': '#f39c12',
        'Cancelled': '#e74c3c',
        'Cancelado': '#e74c3c',
        'Completed': '#27ae60',
        'Completado': '#27ae60'
      };
      return colors[status] || '#4ECDC4';
    },

    handleDateClick(info) {
      // Al hacer clic en una fecha, abrir modal para crear evento
      this.selectedDate = info.dateStr;
      this.selectedEvent = null;
      this.isEdit = false;
      this.createEventVisible = true;
    },

    handleEventClick(info) {
      // Al hacer clic en un evento, abrir modal para editarlo
      const originalEvent = info.event.extendedProps.originalEvent;
      this.selectedEvent = originalEvent;
      this.isEdit = true;
      this.createEventVisible = true;
    },

    handleDateSelect(info) {
      // Al seleccionar un rango de fechas, crear evento
      this.selectedDate = info.startStr;
      this.selectedEvent = null;
      this.isEdit = false;
      this.createEventVisible = true;
    },

    async handleEventDrop(info) {
      // Al arrastrar un evento a otra fecha
      try {
        const originalEvent = info.event.extendedProps.originalEvent;
        const newDate = info.event.start.toISOString();

        const updatedEventData = {
          EventTitle: originalEvent.title,
          EventDate: newDate,
          CustomerName: originalEvent.customerName,
          Location: originalEvent.location,
          Status: this.getStatusValue(originalEvent.status)
        };

        await EventService.updateEvent(originalEvent.id, updatedEventData);
        await this.loadEvents(); // Recargar eventos

        console.log('Evento movido exitosamente');
      } catch (error) {
        console.error('Error al mover evento:', error);
        info.revert(); // Revertir cambio si hay error
      }
    },

    async handleEventResize(info) {
      // Opcional: manejar redimensionar eventos
      console.log('Evento redimensionado:', info);
    },

    getStatusValue(statusString) {
      const statusMap = {
        'Active': 0,
        'Activo': 0,
        'To be confirmed': 1,
        'Por confirmar': 1,
        'Cancelled': 2,
        'Cancelado': 2,
        'Completed': 3,
        'Completado': 3
      };
      return statusMap[statusString] || 0;
    },

    // Modal handlers
    onCloseEventDialog() {
      this.createEventVisible = false;
      this.selectedEvent = null;
      this.isEdit = false;
      this.selectedDate = null;
    },

    async onEventCreated(newEvent) {
      await this.loadEvents(); // Recargar eventos
      this.createEventVisible = false;
    },

    async onEventUpdated(updatedEvent) {
      await this.loadEvents(); // Recargar eventos
      this.createEventVisible = false;
    }
  }
}
</script>

<template>
  <div class="calendar-wrapper" :class="{ 'loading': loading }">
    <div v-if="loading" class="loading-overlay">
      <i class="pi pi-spinner pi-spin"></i>
      <span>Cargando eventos...</span>
    </div>

    <FullCalendar
      ref="fullCalendar"
      class="enhanced-calendar"
      :options="calendarOptions"
    />

    <!-- Event Create/Edit Modal -->
    <event-create-and-edit-dialog
      :visible="createEventVisible"
      :event="selectedEvent"
      :is-edit="isEdit"
      :initial-date="selectedDate"
      @close-dialog="onCloseEventDialog"
      @event-created="onEventCreated"
      @event-updated="onEventUpdated"
      @hide="onCloseEventDialog"
    />
  </div>
</template>

<style scoped>
.calendar-wrapper {
  position: relative;
  width: 100%;
  height: calc(100% - 40px); /* Reducir altura para dar espacio en la parte inferior */
  flex: 1; /* Crecer para ocupar el espacio disponible */
  margin-bottom: 20px; /* Agregar margen inferior para evitar el corte */
}

.calendar-wrapper.loading {
  opacity: 0.7;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 10;
  color: #4ECDC4;
  font-weight: 500;
}

.loading-overlay i {
  font-size: 2rem;
}

/* FullCalendar custom styles */
:deep(.fc) {
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  font-family: inherit;
  height: 100%;
}

:deep(.fc-header-toolbar) {
  background-color: #2c3e50;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #4a5a6b;
}

:deep(.fc-toolbar-title) {
  color: #ecf0f1;
  font-size: 1.4rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
  color: #2c3e50;
  font-weight: 500;
  border-radius: 4px;
  padding: 6px 12px;
}

:deep(.fc-button:hover) {
  background-color: #45b7aa;
  border-color: #45b7aa;
  color: #2c3e50;
}

:deep(.fc-button:focus) {
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.3);
}

:deep(.fc-button-active) {
  background-color: #45b7aa;
  border-color: #45b7aa;
}

:deep(.fc-daygrid) {
  background-color: #34495e;
  border-radius: 8px;
  border: 1px solid #4a5a6b;
  overflow: hidden;
}

:deep(.fc-daygrid-day) {
  background-color: #34495e;
  border-color: #4a5a6b;
  transition: background-color 0.2s ease;
}

:deep(.fc-daygrid-day:hover) {
  background-color: #3a556a;
  cursor: pointer;
}

:deep(.fc-day-header) {
  background-color: #2c3e50;
  color: #95a5a6;
  font-weight: 600;
  border-color: #4a5a6b;
  padding: 10px;
}

:deep(.fc-day-today) {
  background-color: rgba(78, 205, 196, 0.1);
}

:deep(.fc-day-number) {
  color: #ecf0f1;
  padding: 8px;
  font-weight: 500;
}

:deep(.fc-event) {
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.fc-day-past .fc-day-number) {
  color: #7f8c8d;
}

:deep(.fc-scrollgrid) {
  border-color: #4a5a6b;
}

:deep(.fc-scrollgrid-section > *) {
  border-color: #4a5a6b;
}

:deep(.fc-more-link) {
  color: #4ECDC4;
  font-weight: 500;
}

:deep(.fc-more-link:hover) {
  color: #45b7aa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.fc-header-toolbar) {
    flex-direction: column;
    gap: 10px;
  }

  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
  }
}
</style>