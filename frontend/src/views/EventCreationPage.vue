<script setup lang="ts">
import EventForm from "../components/EventForm.vue";
import Footer from "../components/Footer.vue";
import type { Event } from "../models/Event";
</script>

<template>
  <h1 class="p-4 text-xl font-bold">Create New Event</h1>
  <EventForm />
  <Footer />
</template>

<script setup lang="ts">
function handleSubmit() {
  errorMessage.value = "";

  const newEvent: Event = {
    id: generateUniqueUrl(),
    name: eventName.value || "Untitled Event",
    dateRange: {
      start: dateRange.value[0],
      end: dateRange.value[1],
    },
    timeRange: {
      start: formatTime(timeRange.value[0]),
      end: formatTime(timeRange.value[1]),
    },
    venue: {
      name: selectedLocation.value,
      distance: "",
      rating: "",
      category: "",
      votedBy: [],
      link: "",
    },
    responseDeadline: responseDeadline.value,
  };

  console.log("Form submitted", newEvent);

  if (!dateRange.value) {
    errorMessage.value = "Please select a valid date range.";
    return;
  }

  if (!selectedLocation.value) {
    errorMessage.value = "Please select a location for the event.";
    return;
  }

  if (!responseDeadline.value) {
    errorMessage.value = "Please select a deadline.";
    return;
  }

  router.push(`/event/${newEvent.id}`);
}
</script>
