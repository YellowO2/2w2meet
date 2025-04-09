<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Listbox from "primevue/listbox";
import type { Participant } from "../../../shared/Participant";
import type { TimeSlot } from "../../../shared/TimeSlot";
import { WeatherService, type WeatherData } from "../services/WeatherService";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  timeRange: {
    type: Array,
    required: true,
  },
  participants: {
    type: Array as () => Participant[],
    default: () => [],
  },
  currentUserSelections: {
    type: Set,
    default: () => new Set(),
  },
  disabled: {
    type: Boolean,
    default: true,
  },
  eventLocation: {
    type: Object,
    default: () => ({ lat: 1.303323, lng: 103.644022 }), // Default to NTU location
  },
  isFirstDay: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selected"]);

const selectedTimes = ref([]);
const dayWeather = ref<WeatherData | null>(null);
const isLoadingWeather = ref(false);

// Time slots without weather data
const timeSlots = computed(() => {
  const slots = [];
  for (let time = props.timeRange[0]; time <= props.timeRange[1]; time += 0.5) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0.5 ? "30" : "00";
    const timeString = `${hour}:${minute}`;
    const slotId = `${props.date}-${timeString}`;

    const availableParticipants = props.participants.filter((p) =>
      p.availability.includes(slotId)
    );

    slots.push({
      id: slotId,
      date: new Date(props.date),
      time: timeString,
      isSelected: false,
      participants: availableParticipants.map((p) => p.id),
    });
  }
  return slots;
});

// Sync the Listbox UI when parent updates currentUserSelections
watch(
  () => props.currentUserSelections,
  (newSelections) => {
    selectedTimes.value = timeSlots.value.filter((slot) =>
      newSelections.has(slot.id)
    );
  },
  { immediate: true }
);

const onSelectionChange = (event) => {
  const selectedSlotIds = event.value.map((slot) => slot.id);
  emit("update:selected", selectedSlotIds);
};

// Load weather data when the component mounts or when date/location changes
async function fetchWeatherData() {
  if (!props.eventLocation?.lat || !props.eventLocation?.lng) return;

  isLoadingWeather.value = true;
  try {
    dayWeather.value = await WeatherService.getDayWeather(
      props.eventLocation.lat,
      props.eventLocation.lng,
      props.date,
      props.isFirstDay
    );
  } catch (error) {
    console.error("Failed to load weather data:", error);
  } finally {
    isLoadingWeather.value = false;
  }
}

onMounted(fetchWeatherData);
watch(() => props.date, fetchWeatherData);
watch(() => props.eventLocation, fetchWeatherData);

// Utility to get icon class from weather icon code
function getWeatherIconClass(iconCode: string) {
  if (!iconCode) return "wi wi-na";
  return WeatherService.getIconClass(iconCode);
}

function getWeatherColorClass(iconCode: string) {
  if (!iconCode) return "";
  return WeatherService.getWeatherColorClass(iconCode);
}
</script>

<template>
  <div class="time-slot-column">
    <!-- Header with date and weather -->
    <div class="mb-2">
      <h3 class="text-sm font-medium">
        {{ new Date(date).toLocaleDateString() }}
      </h3>
      <div
        v-if="dayWeather"
        class="flex items-center gap-1 mt-1 text-sm"
        :title="dayWeather.description"
      >
        <i
          :class="[
            getWeatherIconClass(dayWeather.icon),
            getWeatherColorClass(dayWeather.icon),
          ]"
        ></i>
        <span>{{ Math.round(dayWeather.temperature) }}°</span>
      </div>
      <div v-else-if="isLoadingWeather" class="text-xs text-gray-500 mt-1">
        <span class="pi pi-spin pi-spinner mr-1"></span>
        Loading...
      </div>
    </div>

    <!-- Time slots list -->
    <Listbox
      v-model="selectedTimes"
      :disabled="disabled"
      :options="timeSlots"
      optionLabel="time"
      :multiple="true"
      @change="onSelectionChange"
      class="w-full"
    >
      <template #option="slotProps">
        <div class="flex justify-between items-center w-full py-1">
          <span>{{ slotProps.option.time }}</span>
          <span class="text-xs text-gray-500">
            {{ slotProps.option.participants.length }}
          </span>
        </div>
      </template>
    </Listbox>
  </div>
</template>

<style>
.time-slot-column {
  min-width: 120px;
}

.p-listbox-list-container {
  max-height: none !important;
  overflow: visible !important;
}

/* Style weather icons */
.wi {
  font-size: 1.2rem;
  line-height: 1;
  vertical-align: middle;
}
</style>
