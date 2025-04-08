<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAuth } from "../services/AuthService";
import { useRouter } from "vue-router";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Event } from "../../../shared/Event";
import Footer from "../components/Footer.vue";
import Card from "primevue/card";
import Avatar from "primevue/avatar";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const router = useRouter();
const { currentUser, loading } = useAuth();

const userEvents = ref<Event[]>([]);
const loadingEvents = ref(true);
const errorFetchingEvents = ref(false);
const errorMessage = ref("");

async function loadUserEvents() {
  if (!currentUser.value) {
    loadingEvents.value = false;
    return;
  }

  try {
    loadingEvents.value = true;
    console.log(
      `Fetching events for user ${currentUser.value.displayName}:`,
      currentUser.value.events
    );

    if (!currentUser.value.events || currentUser.value.events.length === 0) {
      console.log("No events found for user");
      loadingEvents.value = false;
      return;
    }

    const eventsRef = collection(db, "events");
    const fetchedEvents: Event[] = [];

    for (const eventId of currentUser.value.events) {
      try {
        console.log(`Fetching event with ID: ${eventId}`);
        const eventDoc = await getDoc(doc(eventsRef, eventId));

        if (eventDoc.exists()) {
          console.log(`Found event: ${eventDoc.id}`);
          const eventData = eventDoc.data() as Event;
          fetchedEvents.push({
            ...eventData,
            id: eventDoc.id, // Ensure ID is explicitly set or overwritten
          });
        } else {
          console.log(`Event document ${eventId} does not exist`);
        }
      } catch (err) {
        console.error(`Error fetching event ${eventId}:`, err);
      }
    }

    userEvents.value = fetchedEvents;
    console.log(`Loaded ${fetchedEvents.length} events for user`);
  } catch (error) {
    console.error("Error fetching events:", error);
    errorFetchingEvents.value = true;
    errorMessage.value =
      error instanceof Error ? error.message : "Unknown error occurred";
  } finally {
    loadingEvents.value = false;
  }
}

onMounted(async () => {
  if (!loading.value) {
    if (!currentUser.value) {
      router.push("/");
      return;
    }
    await loadUserEvents();
  }
});

// Add a watcher for both loading and currentUser to handle authentication state changes
watch([loading, currentUser], async ([newLoading, newUser], [oldLoading]) => {
  // Only trigger when loading completes (changes from true to false)
  if (oldLoading === true && newLoading === false) {
    if (!newUser) {
      router.push("/");
      return;
    }
    console.log("Auth state loaded, fetching events");
    await loadUserEvents();
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const navigateToEvent = (event: Event) => {
  router.push(`/event/${event.id}`);
};

const getUserRole = (event: Event) => {
  if (event.creatorId === currentUser.value?.id) {
    return "Creator";
  }
  return "Participant";
};
</script>

<template>
  <div class="p-4">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Skeleton width="100%" height="150px" />
    </div>

    <div v-else-if="!currentUser" class="text-center p-8">
      <h2 class="text-2xl mb-4">Please log in to view your profile</h2>
      <router-link to="/">
        <Button label="Go to Home" />
      </router-link>
    </div>

    <div v-else>
      <Card class="mb-6">
        <template #header>
          <div class="flex justify-center p-4 bg-gray-100 dark:bg-gray-800">
            <Avatar
              :image="currentUser.photoURL || undefined"
              :label="
                currentUser.photoURL
                  ? undefined
                  : currentUser.displayName.charAt(0).toUpperCase()
              "
              shape="circle"
              size="xlarge"
            />
          </div>
        </template>

        <template #title>
          <h2 class="text-2xl text-center">{{ currentUser.displayName }}</h2>
        </template>

        <template #subtitle>
          <p class="text-center text-gray-600 dark:text-gray-400">
            {{ currentUser.email }}
          </p>
        </template>
      </Card>

      <div class="mb-4">
        <h3 class="text-xl font-semibold mb-3">My Events</h3>

        <div v-if="loadingEvents" class="p-4">
          <Skeleton width="100%" height="200px" />
        </div>

        <div
          v-else-if="errorFetchingEvents"
          class="p-4 text-center border rounded-md"
        >
          <p class="text-red-500">
            There was an error loading your events:
            {{ errorMessage || "Please try again" }}
          </p>
          <Button label="Retry" class="mt-3" @click="loadUserEvents" />
        </div>

        <div
          v-else-if="userEvents.length === 0"
          class="p-4 text-center border rounded-md"
        >
          <p class="text-gray-600 dark:text-gray-400">
            You haven't created or participated in any events yet.
          </p>
          <router-link to="/create" class="block mt-3">
            <Button label="Create an Event" />
          </router-link>
        </div>

        <DataTable
          v-else
          :value="userEvents"
          stripedRows
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <Column field="name" header="Event Name"></Column>
          <Column header="Date Range">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.dateRange.start) }} -
              {{ formatDate(slotProps.data.dateRange.end) }}
            </template>
          </Column>
          <Column header="Location">
            <template #body="slotProps">
              {{ slotProps.data.area?.name || "Location not specified" }}
            </template>
          </Column>
          <Column header="Role">
            <template #body="slotProps">
              <span
                :class="{
                  'text-blue-600': getUserRole(slotProps.data) === 'Creator',
                }"
              >
                {{ getUserRole(slotProps.data) }}
              </span>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button
                icon="pi pi-external-link"
                text
                @click="navigateToEvent(slotProps.data)"
                tooltip="View Event"
                tooltipOptions="top"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Footer />
  </div>
</template>
