<script setup lang="ts">
import { ref } from "vue";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import { useRouter } from "vue-router";
import LocationSelector from "./LocationSelector.vue";
import { EventController } from "../controllers/EventController";
import { useAuth } from "../services/AuthService";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const router = useRouter();
const controller = new EventController();
const { currentUser, addEventToUser } = useAuth();

const eventName = ref("");
const dateRange = ref();
const timeRange = ref([9, 17]);
const selectedLocation = ref();
const responseDeadline = ref();
const errorMessage = ref("");
const publicEvent = ref(true);

async function handleSubmit() {
  try {
    errorMessage.value = "";

    // Event Name validation
    if (!eventName.value.trim()) {
      errorMessage.value = "Event name cannot be empty.";
      return;
    } else if (eventName.value.length > 50) {
      eventName.value = eventName.value.substring(0, 50);
      errorMessage.value = "Event name truncated to 50 characters.";
    }

    // Date Range validation
    if (
      !dateRange.value ||
      !Array.isArray(dateRange.value) ||
      dateRange.value.length !== 2
    ) {
      errorMessage.value = "Please select a valid date range.";
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today

    // Check if dates are in the future
    if (dateRange.value[0] < now) {
      errorMessage.value = "Date Range: Event dates must be in the future.";
      return;
    }

    // Time Range validation
    if (
      !timeRange.value ||
      !Array.isArray(timeRange.value) ||
      timeRange.value.length !== 2
    ) {
      timeRange.value = [9, 17];
      errorMessage.value = "Default time range applied.";
    }

    if (!selectedLocation.value) {
      errorMessage.value = "Please select a location for the event.";
      return;
    }

    // Response Deadline validation
    if (!responseDeadline.value) {
      errorMessage.value = "Please select a response deadline.";
      return;
    }

    // Check if response deadline is in the future
    if (responseDeadline.value < now) {
      errorMessage.value = "Response deadline must be in the future.";
      return;
    }

    // Check if response deadline is before or within the event date range
    if (responseDeadline.value > dateRange.value[0]) {
      errorMessage.value =
        "Response deadline must be before the event start date.";
      return;
    }

    // Check if user is logged in
    if (!currentUser.value) {
      errorMessage.value = "You must be logged in to create an event.";
      return;
    }

    // Create event object with creator information
    const eventData = {
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
      creatorId: currentUser.value.id, // Match the ID field from User type
      createdBy: currentUser.value.displayName || currentUser.value.email,
      participants: [], // Initialize with empty array to match Participant[] type
      meetupLocations: [], // Initialize with empty array to match type
      notified: false, // Required by Event type
      isPublic: publicEvent.value,
    };

    // Create event using controller
    const eventId = await controller.createEvent(eventData);

    // Add event to user's events in Firestore
    try {
      const userRef = doc(db, "users", currentUser.value.id); // Use id instead of uid
      await updateDoc(userRef, {
        events: arrayUnion(eventId),
        createdEvents: arrayUnion(eventId),
      });

      console.log(`Added event ${eventId} to user ${currentUser.value.id}`);
    } catch (error) {
      console.error("Error updating user's events:", error);
      // Continue even if this fails, as the event was created successfully
    }

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

    <div class="field mt-4 flex items-center gap-2">
      <Checkbox v-model="publicEvent" :binary="true" inputId="publicEvent" />
      <label for="publicEvent">Allow non-registered users to participate</label>
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
