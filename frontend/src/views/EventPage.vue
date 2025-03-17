<script setup lang="ts">
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Footer from "../components/Footer.vue";
import TimeSlotSelector from "../components/TimeSlotSelector.vue";

// Mock data
const eventData = {
  eventName: "testeventname",
  dateRange: ["2025-03-09T16:00:00.000Z", "2025-03-12T16:00:00.000Z"],
  timeRange: [9, 17],
  selectedLocation: "50 Nanyang Ave, Singapore 639798",
  responseDeadline: "2025-03-24T16:00:00.000Z",
};

const email = ref("");
const uniqueUrl = ref("https://example.com/event/unique-id");
const participantsAvailability = ref([]); // Mock participant availability data
const selectedTimeSlots = ref(new Set());
const weatherInfo = ref({}); // Mock weather information
const meetupLocations = ref([
  {
    name: "Starbucks",
    distance: "0.5 km",
    rating: "4.5 stars",
    category: "Cafe",
    votes: 2,
    link: "https://maps.google.com",
  },
  // Add more mock locations here
]);

// Add mock participants data
const participants = ref([
  {
    name: "Person A",
    availableTimes: [
      "2025-03-09T16:00:00.000Z-9:00",
      "2025-03-09T16:00:00.000Z-9:30",
    ],
  },
  {
    name: "Person B",
    availableTimes: [
      "2025-03-09T16:00:00.000Z-9:00",
      "2025-03-10T16:00:00.000Z-14:00",
    ],
  },
]);

const dates = computed(() => {
  const start = new Date(eventData.dateRange[0]);
  const end = new Date(eventData.dateRange[1]);
  const dates = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString());
  }
  return dates;
});

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(value) {
  const hour = Math.floor(value);
  const minute = value % 1 === 0.5 ? "30" : "00";
  return `${hour}:${minute}`;
}

function toggleTimeSlot(date, time) {
  const slot = `${date}-${time}`;
  if (selectedTimeSlots.value.has(slot)) {
    selectedTimeSlots.value.delete(slot);
  } else {
    selectedTimeSlots.value.add(slot);
  }
}

function copyUrl() {
  navigator.clipboard
    .writeText(uniqueUrl.value)
    .then(() => {
      alert("URL copied to clipboard.");
    })
    .catch(() => {
      alert("Failed to copy URL. Please try again.");
    });
}

function voteLocation(location) {
  meetupLocations.value.forEach((loc) => {
    if (loc.name === location.name) {
      loc.votes += 1;
    } else {
      loc.votes = Math.max(0, loc.votes - 1);
    }
  });
}
</script>

<template>
  <div class="p-4">
    <h1>{{ eventData.eventName }}</h1>
    <p>Location: {{ eventData.selectedLocation }}</p>

    <div class="mb-4">
      <h2>Availability Grid</h2>
      <div class="overflow-x-auto">
        <div class="flex gap-4">
          <TimeSlotSelector
            v-for="date in dates"
            :key="date"
            :date="date"
            :time-range="eventData.timeRange"
            :participants="participants"
            @update:selected="(times) => toggleTimeSlot(date, times)"
          />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h2>Location Voting</h2>
      <div class="border p-4">
        <ul>
          <li v-for="location in meetupLocations" :key="location.name">
            <a :href="location.link" target="_blank">{{ location.name }}</a> -
            {{ location.distance }} - {{ location.rating }} -
            {{ location.category }}
            <button @click="voteLocation(location)">Vote</button> Votes:
            {{ location.votes }}
          </li>
        </ul>
      </div>
    </div>

    <div class="mb-4">
      <h2>Get Notified</h2>
      <InputText
        v-model="email"
        placeholder="Enter your email"
        class="w-full"
      />
      <Button label="Subscribe" class="mt-2" />
    </div>

    <Button
      label="Copy Event URL"
      icon="pi pi-copy"
      class="mb-4"
      @click="copyUrl"
    />

    <Footer />
  </div>
</template>
