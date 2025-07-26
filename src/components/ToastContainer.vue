<template>
  <div class="toast-container">
    <ToastNotification
      v-for="toast in toasts"
      :key="toast.id"
      :show="true"
      :message="toast.message"
      :variant="toast.variant"
      :icon="toast.icon"
      :celebration="toast.celebration"
      :duration="0"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import ToastNotification from './ToastNotification.vue'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}
</style>
