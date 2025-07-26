<template>
  <div class="progress-container">
    <div
      class="progress-bar"
      :class="`progress-bar--${variant}`"
      :style="{ height: height }"
    >
      <div
        class="progress-fill"
        :style="{ width: `${clampedPercentage}%` }"
      ></div>
    </div>
    <div class="progress-label" v-if="showText">
      {{ Math.round(clampedPercentage) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  percentage: number;
  variant?: "mini" | "default" | "chapter" | "overall";
  height?: string;
  showText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  height: "20px",
  showText: false,
});

const clampedPercentage = computed(() => {
  return Math.max(0, Math.min(100, props.percentage || 0));
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  position: relative;
}

.progress-bar {
  position: relative;
  border-radius: 2px;
  overflow: hidden;
  background: #1a252f;
  width: 100%;
}

.progress-bar--mini {
  height: 6px !important;
}

.progress-bar--default {
  height: 20px;
}

.progress-bar--chapter {
  height: 24px;
}

.progress-bar--overall {
  height: 32px;
}

.progress-fill {
  height: 100%;
  background: #5dade2;
  transition: width 0.2s linear;
  border-radius: inherit;
}

.progress-label {
  text-align: right;
  margin-top: 2px;
  font-size: 0.7em;
  font-weight: 400;
  color: #95a5a6;
}
</style>
