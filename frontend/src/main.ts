import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
// import Calendar from 'primevue/calendar';
// import Slider from 'primevue/slider';
import Aura from "@primeuix/themes/aura";
import "./style.css";
import "primeicons/primeicons.css";

const app = createApp(App);
app.use(PrimeVue, {
	theme: {
		preset: Aura,
	},
});

app.use(router);

// declare global components so dont need to import
app.component("Button", Button);
app.component("InputText", InputText);
// app.component('Calendar', Calendar);
// app.component('Slider', Slider);

app.mount("#app");
