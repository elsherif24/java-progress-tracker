<template>
  <div
    class="progress-bar"
    :class="[`progress-bar--${variant}`, { 'progress-bar--animated': animated }]"
    :style="{ height: height }"
  >
    <div class="progress-fill" :style="{ width: `${percentage}%` }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  variant?: 'default' | 'mini' | 'chapter'
  height?: string
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  height: '18px',
  animated: true,
})
</script>

<style scoped>
.progress-bar {
  background: linear-gradient(135deg, var(--input-bg), var(--card-bg));
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-color);
  box-shadow:
    inset 0 3px 12px rgba(0, 0, 0, 0.4),
    0 1px 5px rgba(0, 0, 0, 0.2);
  position: relative;
}

.progress-bar--mini {
  height: 8px !important;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.progress-bar--chapter {
  border: 2px solid var(--accent-color);
  box-shadow:
    inset 0 3px 15px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(243, 156, 18, 0.3);
}

.progress-bar--default {
  height: 40px;
  border-radius: 25px;
  border: 3px solid var(--border-color);
  box-shadow:
    inset 0 4px 20px rgba(0, 0, 0, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Scanner animation only for animated bars */
.progress-bar--animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  animation: bar-scanner 3s linear infinite;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    45deg,
    var(--primary-color) 0%,
    var(--secondary-color) 30%,
    #5dade2 60%,
    var(--primary-color) 100%
  );
  background-size: 400% 400%;
  border-radius: inherit;
  transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow:
    0 0 15px rgba(93, 173, 226, 0.4),
    inset 0 1px 5px rgba(255, 255, 255, 0.3);
}

.progress-bar--animated .progress-fill {
  animation: progress-wave 3s ease-in-out infinite;
}

.progress-bar--mini .progress-fill {
  border-radius: 4px;
  box-shadow:
    0 0 8px rgba(93, 173, 226, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
}

.progress-bar--default .progress-fill {
  background: linear-gradient(
    45deg,
    #58d68d 0%,
    #5dade2 25%,
    #3498db 50%,
    #58d68d 75%,
    #5dade2 100%
  );
  background-size: 300% 300%;
  border-radius: 22px;
  transition: width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow:
    0 0 20px rgba(88, 214, 141, 0.5),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
}

.progress-bar--chapter .progress-fill {
  background: linear-gradient(45deg, var(--accent-color) 0%, #ffb347 50%, var(--accent-color) 100%);
  background-size: 200% 100%;
  border-radius: 18px;
}

@keyframes progress-wave {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes bar-scanner {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
