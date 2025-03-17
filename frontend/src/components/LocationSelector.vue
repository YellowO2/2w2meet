<template>
  <div>
    <input
      id="autocomplete"
      type="text"
      placeholder="Enter a location"
      class="w-full p-2 border rounded"
    />
    <div id="map" class="w-full h-64 mt-2"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const locationModel = defineModel(); // This will bind to v-model in parent

let map: google.maps.Map;
let autocomplete: google.maps.places.Autocomplete;

onMounted(() => {
  const input = document.getElementById("autocomplete") as HTMLInputElement;
  const mapElement = document.getElementById("map") as HTMLElement;

  map = new google.maps.Map(mapElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["place_id", "geometry", "name", "formatted_address"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      return;
    }

    // Update map
    map.setCenter(place.geometry.location);
    map.setZoom(15);
    new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });

    // Emit the selected location as a formatted address (or place.name)
    locationModel.value = place.formatted_address || place.name || "";
  });
});
</script>

<style scoped>
#map {
  height: 300px;
}
</style>
