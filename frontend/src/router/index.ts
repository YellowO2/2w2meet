import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/LandingPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
    {
      path: "/create",
      name: "create",
      component: () => import("../views/EventCreationPage.vue"),
    },
    {
      path: "/event/:id",
      name: "event",
      component: () => import("../views/EventPage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfilePage.vue"),
    },
    {
      path: "/my-events",
      name: "myEvents",
      component: () => import("../views/ProfilePage.vue"),
    },
  ],
});

export default router;
