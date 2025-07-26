<template>
  <Teleport to="body">
    <div v-if="show" class="modal" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>⚠️ Confirm Action</h2>
          <button class="close" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
          <div class="modal-actions">
            <button class="control-btn danger" @click="confirm">Yes</button>
            <button class="control-btn secondary" @click="close">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  message: string
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const confirm = () => {
  emit('confirm')
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
/* Inherits modal styles from global CSS */
</style>
