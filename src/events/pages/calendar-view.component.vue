<script>
import MiniCalendar from "../components/mini-calendar.component.vue";
import EventCalendar from "../components/event-calendar.component.vue";

export default {
  name: "calendar-view",
  components: {MiniCalendar, EventCalendar},
}
</script>

<template>
  <div class="grid grid-cols-4 gap-4 p-5 bg-slate-800 min-h-screen">
    <div class="col-span-1 bg-slate-700 rounded-lg p-4 border border-slate-600">
      <mini-calendar/>
    </div>
    <div class="col-span-3 bg-slate-700 rounded-lg p-4 border border-slate-600">
      <event-calendar/>
    </div>
  </div>

</template>

<style scoped>

</style>