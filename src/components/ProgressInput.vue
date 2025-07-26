<template>
  <div class="progress-item">
    <label class="progress-label">{{ label }}:</label>
    <div class="progress-controls">
      <input
        type="number"
        :value="modelValue"
        @input="updateValue"
        :max="max"
        min="0"
        class="progress-input"
      />
      <span class="progress-total">/ {{ max }}</span>
    </div>
    <ProgressBar
      :percentage="percentage"
      :variant="progressBarVariant"
      :show-text="showPercentage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProgressBar from "./ProgressBar.vue";

interface Props {
  label: string;
  modelValue: number;
  max: number;
  progressBarVariant?: "default" | "mini" | "chapter";
  showPercentage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  progressBarVariant: "mini",
  showPercentage: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const percentage = computed(() => {
  return props.max > 0 ? (props.modelValue / props.max) * 100 : 0;
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10) || 0;
  emit("update:modelValue", Math.min(Math.max(0, value), props.max));
};
</script>
