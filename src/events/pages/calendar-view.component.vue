<script>
import EventCalendar from "../components/event-calendar.component.vue";

export default {
  name: "calendar-view",
  components: {EventCalendar},
}
</script>

<template>
  <div class="calendar-page">
    <event-calendar/>
  </div>
</template>

<style scoped>
.calendar-page {
  padding: 20px; /* Agregamos padding para que no esté pegado a los bordes */
  height: 100%; /* Usamos toda la altura disponible del contenedor flex */
  background-color: #121212;
  color: #ecf0f1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>