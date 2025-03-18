<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import Listbox from "primevue/listbox";
import type { Location } from "../models/Location";

const props = defineProps({
  locations: {
    type: Array as () => Location[],
    required: true,
  },
  modelValue: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <Listbox
    :modelValue="modelValue"
    :options="locations"
    optionLabel="name"
    :disabled="disabled"
    class="w-full"
    @change="(e) => emit('update:modelValue', e.value.name)"
  >
    <template #option="{ option }">
      <div class="flex justify-between items-center p-3">
        <div class="font-bold">{{ option.name }}</div>
        <div class="flex items-center gap-2">
          <span class="bg-gray-100 px-2 py-1 rounded">
            {{ option.votedBy.length }} votes
          </span>
        </div>
      </div>
    </template>
  </Listbox>
</template>

<style scoped>
/* :deep(.p-listbox) {
  border: none;
  background: transparent;
} */

/* :deep(.p-listbox-item) {
  margin: 0.5rem 0;
  border: 1px solid var(--surface-200);
  border-radius: 0.5rem;
  background: white;
} */
/* 
:deep(.p-listbox-item.p-highlight) {
  background: var(--primary-50);
  border-color: var(--primary-500);
  color: var(--text-color);
} */

/* :deep(.p-listbox-list) {
  padding: 0.5rem;
} */
</style>
