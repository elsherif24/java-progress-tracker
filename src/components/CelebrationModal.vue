<template>
  <Teleport to="body">
    <div v-if="show" class="modal" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎉 Congratulations!</h2>
          <button class="close" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
          <div class="confetti">🎊</div>
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
  close: []
}>()

const close = () => {
  emit('close')
}
</script>

<style scoped>
.confetti {
  font-size: 3em;
  text-align: center;
  margin: 20px 0;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
