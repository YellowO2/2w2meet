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
import type { Event } from "../models/Event";
import type { Location } from "../models/Location";
import type { Participant } from "../models/Participant";

// Initialize controller and route
const route = useRoute();
const controller = new EventController();

// Local states
const event = ref<Event | null>(null);
const selectedTimeSlots = ref(new Set<string>());
const meetupLocations = ref<Location[]>([]);
const currentUser = ref<Participant | null>();
const userName = ref("");
const userPassword = ref("");

// Fetch event data on mount
onMounted(async () => {
  const eventId = route.params.id as string;
  await controller.fetchEvent(eventId);
  event.value = controller.getEvent().value;

  // Initialize local states
  if (event.value) {
    meetupLocations.value = event.value.meetupLocations;
  }
});

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

// Methods
function login() {
  if (userName.value.trim()) {
    currentUser.value = {
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
    alert("Event saved successfully!");
  }
}

function toggleTimeSlots(date: string, selectedSlotIds: string[]) {
  if (!currentUser.value) {
    alert("Please log in to select time slots.");
    return;
  }

  const userIndex = event.value?.participants.findIndex(
    (p) => p.id === currentUser.value?.id
  );

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
  location.votedBy.push(currentUser.value.name);
}
</script>

<template>
  <div class="p-4">
    <h1>{{ event?.name }}</h1>
    <p>Location: {{ event?.area }}</p>

    <!-- Copy URL and User Info Section -->
    <div class="mb-4 mt-4 flex justify-between items-center">
      <Button label="Save Event" icon="pi pi-save" @click="saveEvent" />
      <div v-if="currentUser" class="flex items-center gap-2">
        <span>Welcome, {{ currentUser.name }}</span>
        <Button
          label="Logout"
          @click="currentUser = null"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Inline Login Section -->
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
                :time-range="[event?.timeRange.start, event?.timeRange.end]"
                :participants="event?.participants"
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
            :user-vote="
              currentUser
                ? meetupLocations.find((loc) =>
                    loc.votedBy.includes(currentUser.name)
                  )?.name || ''
                : ''
            "
            @update:voteLocation="voteLocation"
          />
        </div>
      </TabPanel>
    </TabView>

    <Footer />
  </div>
</template>
