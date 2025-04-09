<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../services/AuthService";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Divider from "primevue/divider";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible", "switchToLogin"]);

const { registerUser, loginWithGoogle } = useAuth();

const displayName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleSignup = async () => {
  if (
    !displayName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  const result = await registerUser(
    email.value,
    password.value,
    displayName.value
  );

  loading.value = false;

  if (result.error) {
    // Parse error message to display cleaner version
    if (result.error.includes("Firebase:")) {
      // Extract the message between the square brackets if it exists
      const bracketMatch = result.error.match(/\[(.*?)\]/);
      if (bracketMatch && bracketMatch[1]) {
        errorMessage.value = bracketMatch[1];
      } else {
        // If no brackets, extract the message between "Firebase: " and " (auth/"
        const errorMatch = result.error.match(/Firebase: (.*?) \(auth\//);
        if (errorMatch && errorMatch[1]) {
          errorMessage.value = errorMatch[1];
        } else {
          errorMessage.value = result.error;
        }
      }
    } else {
      errorMessage.value = result.error;
    }
  } else {
    // Registration successful
    emit("update:visible", false);
  }
};

const handleGoogleSignup = async () => {
  loading.value = true;
  errorMessage.value = "";

  const result = await loginWithGoogle();

  loading.value = false;

  if (result.error) {
    errorMessage.value = result.error;
  } else {
    // Google signup successful
    emit("update:visible", false);
  }
};

const switchToLogin = () => {
  emit("update:visible", false);
  emit("switchToLogin");
};
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    header="Create an Account"
    modal
    :closable="true"
    :dismissableMask="true"
    @update:visible="(val) => emit('update:visible', val)"
    class="auth-modal"
    :style="{ width: '450px' }"
    :pt="{
      root: { class: 'border-round-lg overflow-hidden' },
      content: { class: 'p-4' },
    }"
  >
    <div class="flex flex-col gap-4 p-3">
      <div class="field">
        <label for="displayName" class="block mb-2 font-medium"
          >Display Name</label
        >
        <InputText
          id="displayName"
          type="text"
          v-model="displayName"
          class="w-full p-3"
          placeholder="Enter your name"
          :disabled="loading"
        />
      </div>

      <div class="field">
        <label for="email" class="block mb-2 font-medium">Email</label>
        <InputText
          id="email"
          type="email"
          v-model="email"
          class="w-full p-3"
          placeholder="Enter your email"
          :disabled="loading"
        />
      </div>

      <div class="field">
        <label for="password" class="block mb-2 font-medium">Password</label>
        <Password
          id="password"
          v-model="password"
          toggleMask
          class="w-full"
          inputClass="w-full p-3"
          placeholder="Create a password"
          :disabled="loading"
          :feedback="false"
        />
      </div>

      <div class="field">
        <label for="confirmPassword" class="block mb-2 font-medium"
          >Confirm Password</label
        >
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          toggleMask
          class="w-full"
          inputClass="w-full p-3"
          placeholder="Confirm your password"
          :disabled="loading"
          :feedback="false"
          @keyup.enter="handleSignup"
        />
      </div>

      <div v-if="errorMessage" class="p-error px-2 py-1 text-sm text-red-600">
        {{ errorMessage }}
      </div>

      <Button
        label="Sign up"
        class="w-full p-button-raised p-3 mt-2"
        @click="handleSignup"
        :loading="loading"
      />

      <Divider align="center">
        <span class="text-sm text-600">OR</span>
      </Divider>

      <Button
        label="Sign up with Google"
        icon="pi pi-google"
        class="p-button-secondary w-full p-3"
        @click="handleGoogleSignup"
        :loading="loading"
      />

      <div class="text-center mt-3">
        <span class="text-sm">Already have an account? </span>
        <a
          href="#"
          class="text-sm text-primary font-medium"
          @click.prevent="switchToLogin"
          >Login</a
        >
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.auth-modal {
  min-width: 350px;
  max-width: 90vw;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

@media (max-width: 768px) {
  .auth-modal {
    width: 90vw !important;
  }
}
</style>
