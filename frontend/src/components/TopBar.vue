<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../services/AuthService";
import LoginModal from "./LoginModal.vue";
import SignupModal from "./SignupModal.vue";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Button from "primevue/button";

const { currentUser, loading, logoutUser } = useAuth();

const loginModalVisible = ref(false);
const signupModalVisible = ref(false);
const userMenu = ref();
const mobileMenuOpen = ref(false);
const userMenuItems = ref([
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => navigateToProfile(),
  },
  {
    label: "My Events",
    icon: "pi pi-calendar",
    command: () => navigateToMyEvents(),
  },
  {
    separator: true,
  },
  {
    label: "Logout",
    icon: "pi pi-power-off",
    command: () => handleLogout(),
    class: "text-red-500",
  },
]);

const navigateToProfile = () => {
  window.location.href = "/profile";
};

const navigateToMyEvents = () => {
  window.location.href = "/my-events";
};

const handleLogout = async () => {
  await logoutUser();
};

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const showLoginModal = () => {
  loginModalVisible.value = true;
};

const showSignupModal = () => {
  signupModalVisible.value = true;
};

const switchToSignup = () => {
  signupModalVisible.value = true;
};

const switchToLogin = () => {
  loginModalVisible.value = true;
};

const generateAvatarColor = (name) => {
  const colors = ["#DB7093", "#C71585"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav
      class="bg-white shadow-sm dark:bg-gray-900 fixed w-full top-0 left-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo and App Name -->
            <router-link to="/" class="flex items-center">
              <span class="text-2xl font-bold text-blue-600 dark:text-white"
                >2W2Meet</span
              >
            </router-link>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{
                'text-blue-600 dark:text-blue-500': $route.path === '/',
              }"
            >
              Home
            </router-link>
            <router-link
              to="/create"
              class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{
                'text-blue-600 dark:text-blue-500': $route.path === '/create',
              }"
            >
              Create Event
            </router-link>

            <!-- Auth Section -->
            <div v-if="!loading" class="ml-4">
              <!-- Logged In User -->
              <div v-if="currentUser" class="relative">
                <Button
                  text
                  rounded
                  @click="toggleUserMenu"
                  class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                >
                  <Avatar
                    :image="currentUser.photoURL || ''"
                    :label="
                      currentUser.displayName?.charAt(0).toUpperCase() || 'U'
                    "
                    shape="circle"
                    size="small"
                    class="mr-1"
                    :style="{
                      backgroundColor: !currentUser.photoURL
                        ? generateAvatarColor(currentUser.displayName || 'User')
                        : 'transparent',
                      color: !currentUser.photoURL ? 'white' : 'inherit',
                    }"
                  />
                  <span>{{ currentUser.displayName }}</span>
                  <i class="pi pi-angle-down text-xs"></i>
                </Button>
                <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
              </div>

              <!-- Not Logged In -->
              <div v-else class="flex items-center gap-3">
                <Button
                  label="Login"
                  text
                  @click="showLoginModal"
                  class="px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500 text-sm font-medium rounded-md transition-colors"
                />
                <Button
                  label="Sign up"
                  @click="showSignupModal"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                  severity="primary"
                />
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-gray-800"
              aria-controls="mobile-menu"
              :aria-expanded="mobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <i class="pi pi-bars text-xl" v-if="!mobileMenuOpen"></i>
              <i class="pi pi-times text-xl" v-else></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state -->
      <div class="md:hidden" id="mobile-menu" v-show="mobileMenuOpen">
        <div
          class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t dark:border-gray-700"
        >
          <router-link
            to="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-500 dark:hover:bg-gray-800"
            :class="{
              'bg-gray-50 text-blue-600 dark:bg-gray-800 dark:text-blue-500':
                $route.path === '/',
            }"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>
          <router-link
            to="/create"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-500 dark:hover:bg-gray-800"
            :class="{
              'bg-gray-50 text-blue-600 dark:bg-gray-800 dark:text-blue-500':
                $route.path === '/create',
            }"
            @click="mobileMenuOpen = false"
          >
            Create Event
          </router-link>

          <div v-if="!loading" class="px-3 py-2">
            <!-- Mobile Logged In User -->
            <div v-if="currentUser">
              <div class="flex items-center mb-3">
                <Avatar
                  :image="currentUser.photoURL || ''"
                  :label="
                    currentUser.displayName?.charAt(0).toUpperCase() || 'U'
                  "
                  shape="circle"
                  size="normal"
                  class="mr-2"
                  :style="{
                    backgroundColor: !currentUser.photoURL
                      ? generateAvatarColor(currentUser.displayName || 'User')
                      : 'transparent',
                    color: !currentUser.photoURL ? 'white' : 'inherit',
                  }"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{
                  currentUser.displayName
                }}</span>
              </div>
              <div class="space-y-1">
                <router-link
                  to="/profile"
                  class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-500 dark:hover:bg-gray-800"
                  @click="mobileMenuOpen = false"
                >
                  <i class="pi pi-user mr-2"></i>Profile
                </router-link>
                <router-link
                  to="/my-events"
                  class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-500 dark:hover:bg-gray-800"
                  @click="mobileMenuOpen = false"
                >
                  <i class="pi pi-calendar mr-2"></i>My Events
                </router-link>
                <button
                  @click="
                    handleLogout();
                    mobileMenuOpen = false;
                  "
                  class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800"
                >
                  <i class="pi pi-power-off mr-2"></i>Logout
                </button>
              </div>
            </div>

            <!-- Mobile Not Logged In -->
            <div v-else class="flex flex-col space-y-2">
              <Button
                label="Login"
                @click="
                  showLoginModal();
                  mobileMenuOpen = false;
                "
                class="w-full p-2 text-center text-gray-700 hover:text-blue-600 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md font-medium"
              />
              <Button
                label="Sign up"
                @click="
                  showSignupModal();
                  mobileMenuOpen = false;
                "
                class="w-full p-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer to account for fixed navbar -->
    <div class="h-16"></div>

    <!-- Auth Modals -->
    <LoginModal
      v-model:visible="loginModalVisible"
      @switch-to-signup="switchToSignup"
    />
    <SignupModal
      v-model:visible="signupModalVisible"
      @switch-to-login="switchToLogin"
    />
  </div>
</template>

<style scoped>
:deep(.p-avatar) {
  background-color: #4f46e5;
}

:deep(.p-menuitem-link:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.p-menuitem-link .p-menuitem-text) {
  color: #374151;
}

:deep(.p-menuitem-link .p-menuitem-icon) {
  color: #6b7280;
}

:deep(.p-menuitem-link:hover .p-menuitem-text) {
  color: #4f46e5;
}

:deep(.p-menuitem-link:hover .p-menuitem-icon) {
  color: #4f46e5;
}

:deep(.p-menu) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  min-width: 180px;
}
</style>
