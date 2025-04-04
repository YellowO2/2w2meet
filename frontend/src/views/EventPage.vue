<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Footer from "../components/Footer.vue";
import TimeSlotSelector from "../components/TimeSlotSelector.vue";
import LocationVoting from "../components/LocationVoting.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { EventController } from "../controllers/EventController";
import type { Event } from "../../../shared/Event";
import type { Establishment } from "../../../shared/Location";
import type { Participant } from "../../../shared/Participant";

// Initialize controller and route
const route = useRoute();
const controller = new EventController();

// Local states
const event = ref<Event | null>(null);
const selectedTimeSlots = ref(new Set<string>());
const meetupLocations = ref<Establishment[]>([]);
const currentUser = ref<Participant | null>();
const userName = ref("");
const emailAddress = ref("");
const hasUnsavedChanges = ref(false);
const originalEventState = ref<Event | null>(null);
const errorMessage = ref("");

// Fetch event data on mount
onMounted(async () => {
  const eventId = route.params.id as string;

  // TODO: Replace controller with backend route
  await controller.fetchEvent(eventId);
  event.value = controller.getEvent().value;

  // Store original state for comparison
  if (event.value) {
    // Used to create deep copy
    originalEventState.value = JSON.parse(JSON.stringify(event.value));
    meetupLocations.value = event.value.meetupLocations;
  }
});

// Add warning if they try to leave without saving
onMounted(() => {
  window.addEventListener("beforeunload", (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
});

function checkForChanges() {
  if (!event.value || !originalEventState.value) return;
  hasUnsavedChanges.value =
    JSON.stringify(event.value) !== JSON.stringify(originalEventState.value);
}

// Computed properties
const dates = computed(() => {
  if (!event.value) return [];
  const start = new Date(event.value.dateRange.start);
  const end = new Date(event.value.dateRange.end);
  const dates = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString());
  }
  return dates;
});

function login() {
  if (userName.value.trim()) {
    currentUser.value = {
      // TODO: Fix id generation
      // logical OR ('||') has lower precedence than addition ('+'),
      // without the parentheses 0 would bind to 1 instead of length.
      id: (event.value?.participants.length || 0 + 1).toString(),
      name: userName.value,
      availability: [],
    };
    event.value?.participants.push(currentUser.value);
  }
}

function saveEvent() {
  if (event.value) {
    controller.saveEvent(event.value);
    originalEventState.value = JSON.parse(JSON.stringify(event.value));
    hasUnsavedChanges.value = false;
    alert("Event saved successfully!");
  }
}
function toggleTimeSlots(date: string, selectedSlotIds: string[]) {
  if (!currentUser.value) {
    alert("Please log in to select time slots.");
    return;
  }

  const userIndex = findUser();

  if (userIndex !== undefined && userIndex !== -1) {
    const datePrefix = date;
    const existingSlots = new Set(
      event.value?.participants[userIndex].availability
    );

    // Remove existing selections for this date
    event.value!.participants[userIndex].availability = Array.from(
      existingSlots
    ).filter((slot) => !slot.startsWith(datePrefix));

    // Add new selections
    event.value!.participants[userIndex].availability.push(...selectedSlotIds);

    selectedTimeSlots.value = new Set(
      event.value!.participants[userIndex].availability
    );
  }

  checkForChanges();
}

/**
 * I am half as wise as the previous author. This function simply
 * returns the index of the current user in the Event's participant
 * list.
 */
function findUser() {
  return event.value?.participants.findIndex(
    (p) => p.id === currentUser.value?.id
  );
}

function voteLocation(location: Establishment) {
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
  location.votedBy.push(currentUser.value.name);
  checkForChanges();
}

function copyUrl() {
  const url = route.fullPath as string;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("URL copied to clipboard.");
    })
    .catch(() => {
      alert("Failed to copy URL. Please try again.");
    });
}

function submitEmail() {
  errorMessage.value = "";

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress.value)) {
    errorMessage.value = "Please enter a valid email address.";
    return;
  }

  const userIndex = findUser();
  if (userIndex === undefined) return;

  event.value!.participants[userIndex].email = emailAddress.value;

  saveEvent();
}

function logout() {
  if (hasUnsavedChanges.value) {
    const confirmed = window.confirm(
      "You have unsaved changes. Are you sure you want to logout?"
    );
    if (!confirmed) return;
  }
  location.reload();
}
</script>

<template>
  <div class="p-4">
    <h1>{{ event?.name }}</h1>
    <p>Location: {{ event?.area.name }}</p>

    <!-- Copy URL and User Info Section -->
    <div class="mb-4 mt-4 flex justify-between items-center">
      <Button v-if="hasUnsavedChanges" class="fixed shadow-lg" label="Save Changes" icon="pi pi-save" @click="saveEvent"
        severity="warning" />
      <Button label="Copy Event URL" icon="pi pi-copy" @click="copyUrl" />
      <div v-if="currentUser" class="flex items-center gap-2">
        <span>Welcome, {{ currentUser.name }}</span>
        <Button label="Logout" @click="logout" severity="secondary" />
      </div>
    </div>

    <!-- Inline Login Section -->
    <div v-if="!currentUser" class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 class="font-semibold mb-2">Join the Event</h2>
      <div class="flex flex-col gap-3">
        <InputText v-model="userName" placeholder="Enter your name" />
        <!-- <InputText
          v-model="userPassword"
          type="password"
          placeholder="Password (optional)"
        /> -->
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
              <TimeSlotSelector v-for="date in dates" :key="date" :date="date"
                :time-range="[event?.timeRange.start, event?.timeRange.end]" :participants="event?.participants"
                :current-user-selections="selectedTimeSlots" :disabled="!currentUser"
                @update:selected="(slots) => toggleTimeSlots(date, slots)" />
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel v-if="meetupLocations.length > 0" header="Where" value="1">
        <div class="mb-4">
          <h2>Location Voting</h2>
          <LocationVoting :locations="meetupLocations" :disabled="!currentUser" :user-vote="currentUser
            ? meetupLocations.find(
              (loc) =>
                currentUser?.name &&
                loc.votedBy.includes(currentUser.name)
            )?.name || ''
            : ''
            " @update:voteLocation="voteLocation" />
        </div>
      </TabPanel>
      <TabPanel v-else header="Where" value="1">
        <div class="mb-4">
          <h2>Location Voting</h2>
          <h3>No nearby locations found.</h3>
        </div>
      </TabPanel>

    </TabView>

    <!-- Inline Notification Opt-in Section -->
    <div v-if="currentUser && !currentUser.email" class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 class="font-semibold mb-2">Opt-in for Event Notification</h2>
      <div class="flex flex-col gap-3">
        <InputText v-model="emailAddress" placeholder="Enter your email" />
        <Button label="Notify me when finalised" @click="submitEmail" />
      </div>
    </div>

    <div v-if="errorMessage" class="field mt-4">
      <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">{{ errorMessage }}</span>
      </div>
    </div>

    <Footer />
  </div>
</template>
