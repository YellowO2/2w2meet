<script setup lang="ts">
import { ref, computed } from "vue";
import Listbox from "primevue/listbox";

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
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:selected"]);

const selectedTimes = ref([]);

const timeSlots = computed(() => {
  const slots = [];
  for (let time = props.timeRange[0]; time <= props.timeRange[1]; time += 0.5) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0.5 ? "30" : "00";
    const timeString = `${hour}:${minute}`;
    const availableParticipants = props.participants.filter((p) =>
      p.availableTimes.includes(`${props.date}-${timeString}`)
    );

    slots.push({
      time: timeString,
      participants: availableParticipants,
      label: `${timeString} (${availableParticipants.length})`,
    });
  }
  return slots;
});

const onSelectionChange = (event) => {
  emit("update:selected", event.value);
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
            {{ slotProps.option.participants.length }} available
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
