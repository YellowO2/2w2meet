<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
</script>

<template>
  <div class="min-h-screen">
    <TopBar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view></router-view>
    </div>
  </div>
</template>
