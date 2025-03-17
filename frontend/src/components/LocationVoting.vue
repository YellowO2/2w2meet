<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import Listbox from "primevue/listbox";
import Button from "primevue/button";

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["vote"]);

function voteLocation(location) {
  emit("vote", location);
}
</script>

<template>
  <div class="location-voting">
    <Listbox
      :options="locations"
      optionLabel="name"
      class="w-full"
      :disabled="disabled"
    >
      <template #option="slotProps">
        <div class="flex justify-between items-center p-2">
          <div>
            <div class="font-bold">{{ slotProps.option.name }}</div>
            <div class="text-sm text-gray-600">
              {{ slotProps.option.distance }} • {{ slotProps.option.rating }} •
              {{ slotProps.option.category }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span>Votes: {{ slotProps.option.votes }}</span>
          </div>
        </div>
      </template>
    </Listbox>
  </div>
</template>
