<script setup lang="ts">
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Footer from "../components/Footer.vue";
import TimeSlotSelector from "../components/TimeSlotSelector.vue";
import LocationVoting from "../components/LocationVoting.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import type { Location } from "../models/Location";
import type { Participant } from "../models/Participant";
import type { TimeSlot } from "../models/TimeSlot";
import type { Event } from "../models/Event";

// Mock data
const eventData: Event = {
  // dateRange: ["2025-03-09T16:00:00.000Z", "2025-03-12T16:00:00.000Z"],
  // timeRange: [9, 17],
  area: "50 Nanyang Ave, Singapore 639798",
  responseDeadline: "2025-03-24T16:00:00.000Z",
  id: "",
  name: "",
  dateRange: {
    start: "2025-03-09T16:00:00.000Z",
    end: "2025-03-12T16:00:00.000Z",
  },
  timeRange: {
    start: 9,
    end: 17,
  },
  meetupLocations: [],
  participants: [],
};

const email = ref("");
const uniqueUrl = ref("https://example.com/event/unique-id");
const participantsAvailability = ref([]); // Mock participant availability data
const selectedTimeSlots = ref(new Set());
const weatherInfo = ref({}); // Mock weather information
const meetupLocations = ref<Location[]>([
  {
    name: "Starbucks",
    distance: "0.5 km",
    rating: "4.5 stars",
    category: "Cafe",
    votedBy: ["Person A"],
    link: "https://maps.google.com",
  },
  {
    name: "Moonbucks",
    distance: "0.8 km",
    rating: "4.2 stars",
    category: "Cafe",
    votedBy: ["Person A"],
    link: "https://maps.google.com",
  },
  {
    name: "Uranusbucks",
    distance: "0.1 km",
    rating: "4.2 stars",
    category: "Cafe",
    votedBy: ["Person B"],
    link: "https://maps.google.com",
  },
  // Add more mock locations here
]);

//map of a mock data of participant to password
const participantsPassword = ref(
  new Map([
    ["Person A", "passwordA"],
    ["Person B", "passwordB"],
  ])
);

// Add mock participants data
const participants = ref<Participant[]>([
  {
    id: "1",
    name: "Person A",
    availability: [
      "2025-03-09T16:00:00.000Z-9:00",
      "2025-03-09T16:00:00.000Z-9:30",
    ],
  },
  {
    id: "2",
    name: "Person B",
    availability: [
      "2025-03-09T16:00:00.000Z-9:00",
      "2025-03-10T16:00:00.000Z-14:00",
    ],
  },
]);

const currentUser = ref<Participant | null>();
const userName = ref("");
const userPassword = ref("");

const dates = computed(() => {
  const start = new Date(eventData.dateRange.start);
  const end = new Date(eventData.dateRange.end);
  const dates = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString());
  }
  return dates;
});

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(value: number) {
  const hour = Math.floor(value);
  const minute = value % 1 === 0.5 ? "30" : "00";
  return `${hour}:${minute}`;
}

function toggleTimeSlots(date: string, selectedSlotIds: string[]) {
  if (!currentUser.value) {
    alert("Please log in to select time slots.");
    return;
  }

  const userIndex = participants.value.findIndex(
    (p) => p.id === currentUser.value?.id
  );

  if (userIndex !== -1) {
    const datePrefix = date;
    const existingSlots = new Set(participants.value[userIndex].availability);

    // Remove existing selections for this date
    participants.value[userIndex].availability = Array.from(
      existingSlots
    ).filter((slot) => !slot.startsWith(datePrefix));

    // Add new selections
    participants.value[userIndex].availability.push(...selectedSlotIds);

    selectedTimeSlots.value = new Set(
      participants.value[userIndex].availability
    );
  }

  console.log("new participants", participants.value[userIndex]);
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

function voteLocation(location: Location) {
  if (!currentUser.value) {
    alert("Please log in to vote for a location");
    return;
  }

  // Remove user's vote from all locations
  meetupLocations.value.forEach((loc) => {
    const index = currentUser.value
      ? loc.votedBy.indexOf(currentUser.value.name)
      : -1;
    if (index !== -1) {
      loc.votedBy.splice(index, 1);
    }
  });

  // Add vote to selected location
  if (location) {
    location.votedBy.push(currentUser.value.name);
  }
}

function login() {
  if (userName.value.trim()) {
    currentUser.value = {
      id: (participants.value.length + 1).toString(),
      name: userName.value,
      availability: [],
    };

    // Add new participant
    participants.value.push({
      id: currentUser.value.id,
      name: userName.value,
      availability: [],
    });
  }
}

const userLocationVote = computed(() => {
  if (!currentUser.value) return null;
  const votedLoc = meetupLocations.value.find(
    (loc) => currentUser.value && loc.votedBy.includes(currentUser.value.name)
  );
  return votedLoc ? votedLoc.name : null;
});
</script>

<template>
  <div class="p-4">
    <h1>{{ eventData.name }}</h1>
    <p>Location: {{ eventData.area }}</p>

    <!-- Copy URL and User Info Section -->
    <div class="mb-4 mt-4 flex justify-between items-center">
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
                :time-range="[
                  eventData.timeRange.start,
                  eventData.timeRange.end,
                ]"
                :participants="participants"
                :current-user-selections="selectedTimeSlots"
                :disabled="!currentUser"
                @update:selected="(slots) => toggleTimeSlots(date, slots)"
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
            :userVote="userLocationVote || ''"
            @update:voteLocation="voteLocation"
          />
        </div>
      </TabPanel>
    </TabView>

    <Footer />
  </div>
</template>
