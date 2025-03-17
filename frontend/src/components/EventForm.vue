<script setup lang="ts">
import { ref } from "vue";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import LocationSelector from "./LocationSelector.vue";

const router = useRouter();

const eventName = ref("");
const dateRange = ref();
const timeRange = ref([9, 17]);
const selectedLocation = ref("");
const responseDeadline = ref();
const errorMessage = ref("");

function handleSubmit() {
  errorMessage.value = "";
  console.log("Form submitted", {
    eventName: eventName.value,
    dateRange: dateRange.value,
    timeRange: timeRange.value,
    selectedLocation: selectedLocation.value,
    responseDeadline: responseDeadline.value,
  });

  if (!eventName.value) {
    eventName.value = "Untitled Event";
  } else if (eventName.value.length > 50) {
    eventName.value = eventName.value.substring(0, 50);
    errorMessage.value = "Event name truncated to 50 characters.";
  }

  if (!dateRange.value) {
    errorMessage.value = "Please select a valid date range.";
    return;
  }

  if (!timeRange.value) {
    timeRange.value = [9, 17];
    errorMessage.value = "Default time range applied.";
  }

  if (!selectedLocation.value) {
    errorMessage.value = "Please select a location for the event.";
    return;
  }

  if (!responseDeadline.value) {
    errorMessage.value = "Please select a deadline.";
    return;
  }

  // Generate unique URL (mock implementation)
  const uniqueUrl = generateUniqueUrl();
  if (!uniqueUrl) {
    errorMessage.value = "Failed to generate a unique URL. Please try again.";
    return;
  }

  // Redirect to the unique event page
  router.push(`/event/${uniqueUrl}`);
}

function generateUniqueUrl() {
  // Mock implementation of unique URL generation
  return Math.random().toString(36).substr(2, 9);
}
function formatTime(value: number) {
  const hour = Math.floor(value);
  const minute = value % 1 === 0.5 ? "30" : "00";
  return `${hour}:${minute}`;
}
</script>

<template>
  <form class="p-4" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="eventName">Event Name</label>
      <InputText id="eventName" v-model="eventName" class="w-full" />
    </div>

    <div class="field mt-4">
      <label>Date Range</label>
      <Calendar v-model="dateRange" selectionMode="range" class="w-full" />
    </div>

    <div class="field mt-4">
      <label>Time Range</label>
      <Slider
        v-model="timeRange"
        :min="0"
        :max="24"
        :step="0.5"
        range
        class="w-full"
      />
      <div class="mt-2 text-center text-gray-600">
        Selected Time: {{ formatTime(timeRange[0]) }} -
        {{ formatTime(timeRange[1]) }}
      </div>
    </div>

    <div class="field mt-4">
      <label for="selectedLocation">Choose a general area of interest</label>
      <LocationSelector v-model="selectedLocation" />
    </div>

    <div class="field mt-4">
      <label>Response Deadline</label>
      <Calendar v-model="responseDeadline" class="w-full" />
    </div>

    <div v-if="errorMessage" class="field mt-4">
      <div
        class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
    </div>

    <Button label="Create Event" class="mt-4" type="submit" />
  </form>
</template>
