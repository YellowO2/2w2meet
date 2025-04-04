<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
</script>

<template>
  <div class="min-h-screen p-4">
    <TopBar />
    <router-view></router-view>
  </div>
</template>
