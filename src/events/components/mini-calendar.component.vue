<script>


export default{
  name: "mini-calendar",
  data() {
    return {
      selectedDate: new Date()
    }
  }
}
</script>

<template>
  <div class="p-4">
    <div class="calendar-container">
      <h3 class="calendar-title">Calendar</h3>
      <pv-calendar
          v-model="selectedDate"
          inline
          show-week
          class="dark-calendar"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  color: #ecf0f1;
}

.calendar-title {
  color: #ecf0f1;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-calendar .p-datepicker) {
  background-color: #34495e;
  border: 1px solid #4a5a6b;
  border-radius: 8px;
  color: #ecf0f1;
}

:deep(.p-calendar .p-datepicker .p-datepicker-header) {
  background-color: #2c3e50;
  border-bottom: 1px solid #4a5a6b;
  color: #ecf0f1;
}

:deep(.p-calendar .p-datepicker .p-datepicker-title) {
  color: #ecf0f1;
}

:deep(.p-calendar .p-datepicker .p-datepicker-prev),
:deep(.p-calendar .p-datepicker .p-datepicker-next) {
  color: #4ECDC4;
}

:deep(.p-calendar .p-datepicker .p-datepicker-prev:hover),
:deep(.p-calendar .p-datepicker .p-datepicker-next:hover) {
  background-color: #4ECDC4;
  color: #2c3e50;
}

:deep(.p-calendar .p-datepicker table td) {
  border: none;
}

:deep(.p-calendar .p-datepicker table td span) {
  color: #ecf0f1;
  border-radius: 4px;
}

:deep(.p-calendar .p-datepicker table td span:hover) {
  background-color: #4ECDC4;
  color: #2c3e50;
}

:deep(.p-calendar .p-datepicker table td.p-datepicker-today span) {
  background-color: #4ECDC4;
  color: #2c3e50;
  font-weight: 600;
}

:deep(.p-calendar .p-datepicker table th) {
  color: #95a5a6;
  font-weight: 600;
}
</style>