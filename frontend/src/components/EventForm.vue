<script setup lang="ts">
import { ref } from "vue";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import LocationSelector from "./LocationSelector.vue";
import { EventController } from "../controllers/EventController";

const router = useRouter();
// TODO: Move controller to backend
const controller = new EventController();

const eventName = ref("");
const dateRange = ref();
const timeRange = ref([9, 17]);
const selectedLocation = ref();
const responseDeadline = ref();
const errorMessage = ref("");

async function handleSubmit() {
  try {
    errorMessage.value = "";

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

    // Create event using controller
    // TODO: Replace this with a backend route
    const eventId = await controller.createEvent({
      name: eventName.value,
      dateRange: {
        start: dateRange.value[0].toISOString(),
        end: dateRange.value[1].toISOString(),
      },
      timeRange: {
        start: timeRange.value[0],
        end: timeRange.value[1],
      },
      area: selectedLocation.value,
      responseDeadline: responseDeadline.value.toISOString(),
    });

    // Redirect to the event page
    router.push(`/event/${eventId}`);
  } catch (error) {
    errorMessage.value = "Failed to create event. Please try again.";
    console.error("Error creating event:", error);
  }
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
      <Slider v-model="timeRange" :min="0" :max="24" :step="0.5" range class="w-full" />
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
      <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
    </div>

    <Button label="Create Event" class="mt-4" type="submit" />
  </form>
</template>
