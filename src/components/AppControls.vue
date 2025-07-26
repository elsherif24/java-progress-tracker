<template>
  <nav class="controls flex flex-center flex-gap-md">
    <button
      class="control-btn secondary"
      :class="{ 'sound-enabled': soundEnabled }"
      @click="toggleSound"
    >
      {{ soundEnabled ? "🔊 Sound On" : "🔇 Sound Off" }}
    </button>

    <button class="control-btn achievement" @click="exportProgress">
      📊 Export Progress
    </button>
    <label class="control-btn secondary file-input-label">
      📥 Import Progress
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        @change="handleFileImport"
        style="display: none"
      />
    </label>
    <button class="control-btn danger" @click="resetProgress">
      🔄 Reset Progress
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStudyTrackerStore } from "@/stores/counter";
import { soundService } from "@/services/soundService";
const store = useStudyTrackerStore();
const fileInput = ref<HTMLInputElement>();

const soundEnabled = computed(() => soundService.isSoundEnabled());

const toggleSound = () => {
  const newState = soundService.toggleSound();
  const message = `Sound ${newState ? "enabled" : "disabled"}`;
  store.showCelebrationModal(message);
};

const exportProgress = () => {
  store.exportProgress();
};

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    store.importProgress(file);
    // Reset the input value so the same file can be selected again
    target.value = "";
  }
};

const resetProgress = () => {
  store.resetProgress();
};
</script>

<style scoped>
.controls {
  background: var(--light-bg);
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.file-input-label {
  display: inline-block;
  cursor: pointer;
}

@media (max-width: 768px) {
  .controls {
    padding: 15px;
    gap: 10px;
  }
}
</style>
