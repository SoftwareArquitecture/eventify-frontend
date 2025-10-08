<script>
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventApiService } from "../services/event-api.service.js";
import { Event } from "../model/event.entity.js";

export default {
  name: "event-calendar",
  data () {
    return {
      options: {
        plugins : [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',


      },
      events: null,
    }
  },

  created() {
    this.eventApiService = new EventApiService();

  },

  async mounted() {
    try {
      const response = await this.eventApiService.getAllEvents();
      const calendarEvents = response.data.map(event => new Event(event));
      this.events = calendarEvents.map(e => ({
        id: e.id,
        title: e.title,
        start: e.startDate,
        end: e.endDate
      }));
      console.log("Eventos cargados:", this.events);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  }

}
</script>

<template>
  <div class="p-4 w-full h-full" >
    <div class="calendar-main-container">
      <h3 class="calendar-main-title">Events Calendar</h3>
      <pv-full-calendar class="dark-fullcalendar" :events="events" :options="options">
      </pv-full-calendar>
    </div>
  </div>
</template>

<style scoped>
.calendar-main-container {
  color: #ecf0f1;
  height: 100%;
}

.calendar-main-title {
  color: #ecf0f1;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

:deep(.fc) {
  background-color: #34495e;
  border-radius: 8px;
  border: 1px solid #4a5a6b;
  color: #ecf0f1;
}

:deep(.fc-header-toolbar) {
  background-color: #2c3e50;
  padding: 1rem;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #4a5a6b;
}

:deep(.fc-toolbar-title) {
  color: #ecf0f1;
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
  color: #2c3e50;
  font-weight: 500;
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

:deep(.fc-daygrid-day) {
  background-color: #34495e;
  border-color: #4a5a6b;
}

:deep(.fc-daygrid-day:hover) {
  background-color: #3a506b;
}

:deep(.fc-day-header) {
  background-color: #2c3e50;
  color: #95a5a6;
  font-weight: 600;
  border-color: #4a5a6b;
}

:deep(.fc-day-today) {
  background-color: rgba(78, 205, 196, 0.1);
}

:deep(.fc-day-number) {
  color: #ecf0f1;
}

:deep(.fc-event) {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
  color: #2c3e50;
  font-weight: 500;
}

:deep(.fc-event:hover) {
  background-color: #45b7aa;
  border-color: #45b7aa;
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
</style>