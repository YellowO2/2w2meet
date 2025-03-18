<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Listbox from "primevue/listbox";
import type { Participant } from "../models/Participant";
import type { TimeSlot } from "../models/TimeSlot";

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
});

const emit = defineEmits(["update:selected"]);

const selectedTimes = ref([]);

const timeSlots = computed<TimeSlot[]>(() => {
  const slots: TimeSlot[] = [];
  for (let time = props.timeRange[0]; time <= props.timeRange[1]; time += 0.5) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0.5 ? "30" : "00";
    const timeString = `${hour}:${minute}`;
    const slotId = `${props.date}-${timeString}`;

    console.log("slotId", slotId);
    console.log("p availability", props.participants[0].availability);
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
</script>

<template>
  <div class="time-slot-column">
    <h3 class="text-sm font-medium mb-2">
      {{ new Date(date).toLocaleDateString() }}
    </h3>
    <Listbox
      v-model="selectedTimes"
      :disabled="disabled"
      :options="timeSlots"
      optionLabel="label"
      :multiple="true"
      @change="onSelectionChange"
      class="w-full"
    >
      <template #option="slotProps">
        <div class="flex flex-col">
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
  min-width: 100px;
}
.p-listbox-list-container {
  max-height: none !important;
  overflow: visible !important;
}
</style>
