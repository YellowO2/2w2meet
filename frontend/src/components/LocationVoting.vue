<script setup lang="ts">
import type { Location } from "../models/Location";

const props = defineProps({
  locations: {
    type: Array as () => Location[],
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
  userVote: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:voteLocation"]);

function handleLocationClick(location: Location) {
  if (!props.disabled) {
    emit("update:voteLocation", location);
  }
}
</script>

<template>
  <div class="location-voting grid gap-4">
    <div
      v-for="location in locations"
      :key="location.name"
      class="location-card p-4 border rounded-lg cursor-pointer transition-colors"
      :class="{
        'bg-blue-50 border-blue-500': userVote === location.name,
        'hover:bg-gray-50': !disabled,
        'opacity-75 cursor-not-allowed': disabled,
      }"
      @click="handleLocationClick(location)"
    >
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-lg">{{ location.name }}</h3>
          <p class="text-sm text-gray-600">
            {{ location.distance }} • {{ location.rating }} •
            {{ location.category }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-gray-100 px-2 py-1 rounded">
            {{ location.votedBy.length }} votes
          </span>
          <i
            v-if="userVote === location.name"
            class="pi pi-check-circle text-blue-500"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-card {
  background-color: white;
}
</style>
