<script setup lang="ts">
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Footer from "../components/Footer.vue";
import TimeSlotSelector from "../components/TimeSlotSelector.vue";
import LocationVoting from "../components/LocationVoting.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";

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
  {
    name: "Moonbucks",
    distance: "0.8 km",
    rating: "4.2 stars",
    category: "Cafe",
    votes: 2,
    link: "https://maps.google.com",
  },
  {
    name: "Uranusbucks",
    distance: "0.1 km",
    rating: "4.2 stars",
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

const currentUser = ref(null);
const userName = ref("");
const userPassword = ref("");

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
  if (!currentUser.value) {
    alert("Please log in to select time slots.");
    return;
  }

  const slot = `${date}-${time}`;
  if (selectedTimeSlots.value.has(slot)) {
    selectedTimeSlots.value.delete(slot);
  } else {
    selectedTimeSlots.value.add(slot);
  }

  // Update current user's availability
  const userIndex = participants.value.findIndex(
    (p) => p.name === currentUser.value.name
  );
  if (userIndex !== -1) {
    console.log(
      "Updating availability for user:",
      participants.value[userIndex]
    );
    participants.value[userIndex].availableTimes = Array.from(
      selectedTimeSlots.value
    );
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

function login() {
  if (userName.value.trim()) {
    currentUser.value = {
      name: userName.value,
      password: userPassword.value,
    };

    // Add new participant
    participants.value.push({
      name: userName.value,
      availableTimes: [],
    });
  }
}
</script>

<template>
  <div class="p-4">
    <h1>{{ eventData.eventName }}</h1>
    <p>Location: {{ eventData.selectedLocation }}</p>

    <!-- Copy URL and User Info Section -->
    <div class="mb-4 flex justify-between items-center">
      <Button label="Copy Event URL" icon="pi pi-copy" @click="copyUrl" />
      <div v-if="currentUser" class="flex items-center gap-2">
        <span>Welcome, {{ currentUser.name }}</span>
        <Button
          label="Logout"
          @click="currentUser = null"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Inline Login Section (only if not logged in) -->
    <div v-if="!currentUser" class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 class="font-semibold mb-2">Join the Event</h2>
      <div class="flex flex-col gap-3">
        <InputText v-model="userName" placeholder="Enter your name" />
        <InputText
          v-model="userPassword"
          type="password"
          placeholder="Password (optional)"
        />
        <Button label="Join Event" @click="login" />
      </div>
    </div>

    <!-- Tabs Section -->
    <TabView>
      <TabPanel header="When" value="0">
        <div class="mb-4">
          <h2>Availability</h2>
          <div class="overflow-x-auto">
            <div class="flex gap-4">
              <TimeSlotSelector
                v-for="date in dates"
                :key="date"
                :date="date"
                :time-range="eventData.timeRange"
                :participants="participants"
                :disabled="!currentUser"
                @update:selected="(times) => toggleTimeSlot(date, times)"
              />
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Where" value="1">
        <div class="mb-4">
          <h2>Location Voting</h2>
          <LocationVoting
            :locations="meetupLocations"
            :disabled="!currentUser"
            @vote="voteLocation"
          />
        </div>
      </TabPanel>
    </TabView>

    <Footer />
  </div>
</template>
