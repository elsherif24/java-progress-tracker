<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="show"
        class="toast-notification"
        :class="[`toast--${variant}`, { 'toast--celebration': celebration }]"
      >
        <div class="toast-content">
          <div class="toast-icon" v-if="icon">{{ icon }}</div>
          <div class="toast-message">{{ message }}</div>
        </div>

        <!-- Celebration particles for special toasts -->
        <div class="toast-particles" v-if="celebration">
          <div class="particle" v-for="n in 6" :key="n"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  message: string;
  variant?: "success" | "info" | "warning" | "celebration";
  icon?: string;
  celebration?: boolean;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "success",
  celebration: false,
  duration: 3000,
});

const emit = defineEmits<{
  close: [];
}>();

// Auto-close the toast after duration
if (props.show && props.duration > 0) {
  setTimeout(() => {
    emit("close");
  }, props.duration);
}
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  background: var(--card-gradient);
  border-radius: var(--border-radius);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-hover);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transform-origin: top right;
  position: relative;
}

.toast--success {
  border-color: var(--secondary-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(88, 214, 141, 0.15) 100%
  );
  box-shadow:
    var(--shadow-hover),
    0 0 20px rgba(88, 214, 141, 0.3);
}

.toast--celebration {
  border-color: var(--secondary-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(88, 214, 141, 0.1) 50%,
    rgba(93, 173, 226, 0.08) 100%
  );
  box-shadow:
    var(--shadow-hover),
    0 0 20px rgba(88, 214, 141, 0.4);
  animation: celebration-glow 2.5s ease-in-out infinite;
}

.toast--info {
  border-color: var(--primary-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(93, 173, 226, 0.1) 100%
  );
}

.toast--warning {
  border-color: var(--accent-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(243, 156, 18, 0.1) 100%
  );
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  position: relative;
  z-index: 2;
}

.toast-icon {
  font-size: 24px;
  flex-shrink: 0;
  animation: bounce-icon 0.6s ease-out;
}

.toast-message {
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.95em;
  line-height: 1.4;
}

/* Celebration particles */
.toast-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(
    45deg,
    var(--secondary-color),
    var(--primary-color)
  );
  border-radius: 50%;
  animation: particle-float 2.2s ease-out infinite;
}

.particle:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  left: 20%;
  animation-delay: 0.2s;
}
.particle:nth-child(3) {
  left: 30%;
  animation-delay: 0.4s;
}
.particle:nth-child(4) {
  left: 70%;
  animation-delay: 0.1s;
}
.particle:nth-child(5) {
  left: 80%;
  animation-delay: 0.3s;
}
.particle:nth-child(6) {
  left: 90%;
  animation-delay: 0.5s;
}

/* Toast transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

/* Animations */
@keyframes celebration-glow {
  0%,
  100% {
    box-shadow:
      var(--shadow-hover),
      0 0 20px rgba(88, 214, 141, 0.4);
  }
  50% {
    box-shadow:
      var(--shadow-hover),
      0 0 30px rgba(88, 214, 141, 0.6);
  }
}

@keyframes bounce-icon {
  0% {
    transform: scale(0.3) rotate(-10deg);
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(100%) scale(0);
    opacity: 1;
  }
  25% {
    transform: translateY(75%) scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: translateY(50%) scale(1);
    opacity: 0.6;
  }
  75% {
    transform: translateY(25%) scale(0.8);
    opacity: 0.4;
  }
  100% {
    transform: translateY(0%) scale(0.2);
    opacity: 0;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .toast-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }

  .toast-content {
    padding: 14px 16px;
  }

  .toast-icon {
    font-size: 20px;
  }

  .toast-message {
    font-size: 0.9em;
  }
}

/* Stacking multiple toasts */
.toast-notification:nth-child(2) {
  top: 90px;
}

.toast-notification:nth-child(3) {
  top: 160px;
}

.toast-notification:nth-child(4) {
  top: 230px;
}
</style>
