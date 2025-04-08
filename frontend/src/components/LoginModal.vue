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

const emit = defineEmits(["update:visible", "switchToSignup"]);

const { loginUser, loginWithGoogle } = useAuth();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  const result = await loginUser(email.value, password.value);

  loading.value = false;

  if (result.error) {
    errorMessage.value = result.error;
  } else {
    // Login successful
    emit("update:visible", false);
  }
};

const handleGoogleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  const result = await loginWithGoogle();

  loading.value = false;

  if (result.error) {
    errorMessage.value = result.error;
  } else {
    // Google login successful
    emit("update:visible", false);
  }
};

const switchToSignup = () => {
  emit("update:visible", false);
  emit("switchToSignup");
};
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    header="Login"
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
          placeholder="Enter your password"
          :disabled="loading"
          :feedback="false"
          @keyup.enter="handleLogin"
        />
      </div>

      <div v-if="errorMessage" class="p-error px-2 py-1 text-sm">
        {{ errorMessage }}
      </div>

      <Button
        label="Login"
        class="w-full p-button-raised p-3 mt-2"
        @click="handleLogin"
        :loading="loading"
      />

      <Divider align="center">
        <span class="text-sm text-600">OR</span>
      </Divider>

      <Button
        label="Sign in with Google"
        icon="pi pi-google"
        class="p-button-secondary w-full p-3"
        @click="handleGoogleLogin"
        :loading="loading"
      />

      <div class="text-center mt-3">
        <span class="text-sm">Don't have an account? </span>
        <a
          href="#"
          class="text-sm text-primary font-medium"
          @click.prevent="switchToSignup"
          >Sign up</a
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
