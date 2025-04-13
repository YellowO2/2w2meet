<script setup lang="ts">
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="flex-1 surface-ground">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-900 mb-4">
            Simplify Group Meeting Planning
          </h1>
          <p class="text-xl text-600 mb-8">
            Find the perfect time and place for your next meeting with ease
          </p>
          <router-link to="/create" class="no-underline">
            <Button
              label="Create Event"
              icon="pi pi-calendar-plus"
              class="p-button-rounded p-button-lg"
            />
          </router-link>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div class="surface-card p-4 rounded-lg shadow-md text-center">
            <i class="pi pi-calendar text-4xl text-primary mb-3"></i>
            <h3 class="text-xl font-semibold mb-2">Schedule Events</h3>
            <p class="text-600">
              Create and manage events with multiple time slots
            </p>
          </div>
          <div class="surface-card p-4 rounded-lg shadow-md text-center">
            <i class="pi pi-users text-4xl text-primary mb-3"></i>
            <h3 class="text-xl font-semibold mb-2">Group Coordination</h3>
            <p class="text-600">
              Easily collect availability from all participants
            </p>
          </div>
          <div class="surface-card p-4 rounded-lg shadow-md text-center">
            <i class="pi pi-check-circle text-4xl text-primary mb-3"></i>
            <h3 class="text-xl font-semibold mb-2">Smart Selection</h3>
            <p class="text-600">
              Automatically find the best time for everyone
            </p>
          </div>
        </div>

        <!-- How It Works Section -->
        <div class="surface-card p-6 rounded-xl shadow-lg">
          <h2 class="text-3xl font-semibold text-center mb-8">How It Works</h2>
          <div class="flex flex-col gap-6">
            <div class="flex items-center">
              <div
                class="flex-none w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4"
              >
                1
              </div>
              <div>
                <h3 class="text-xl font-medium mb-2">Create Your Event</h3>
                <p class="text-600">
                  Set up your event with possible dates and times
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <div
                class="flex-none w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4"
              >
                2
              </div>
              <div>
                <h3 class="text-xl font-medium mb-2">
                  Share With Participants
                </h3>
                <p class="text-600">Invite others with a simple link</p>
              </div>
            </div>
            <div class="flex items-center">
              <div
                class="flex-none w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4"
              >
                3
              </div>
              <div>
                <h3 class="text-xl font-medium mb-2">Collect Responses</h3>
                <p class="text-600">Participants mark their availability</p>
              </div>
            </div>
            <div class="flex items-center">
              <div
                class="flex-none w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4"
              >
                4
              </div>
              <div>
                <h3 class="text-xl font-medium mb-2">Finalize Details</h3>
                <p class="text-600">
                  Pick the best time and location for everyone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.surface-ground {
  background: linear-gradient(
    180deg,
    var(--surface-ground) 0%,
    var(--surface-card) 100%
  );
}

.surface-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.surface-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}
</style>
