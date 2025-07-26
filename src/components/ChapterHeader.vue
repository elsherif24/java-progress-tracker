<template>
  <div class="chapter-header">
    <div class="chapter-main-info">
      <div class="chapter-number">{{ chapter.id }}</div>
      <div class="chapter-info">
        <h3 class="chapter-title">{{ chapter.title }}</h3>
        <div class="chapter-meta">
          <span>{{ chapter.pages }} pages</span>
          <span>{{ chapter.problems }} problems</span>
        </div>
      </div>
    </div>
    <div class="chapter-status">
      {{ statusIcon }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Chapter, ChapterProgress } from "@/types";

interface Props {
  chapter: Chapter;
  progress: ChapterProgress;
  isCurrent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCurrent: false,
});

const statusIcon = computed(() => {
  if (props.progress.completed) return "✅";
  if (props.isCurrent) return "📚";
  return "📖";
});
</script>

<style scoped>
.chapter-header {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.chapter-main-info {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.chapter-number {
  background: var(--primary-color);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1em;
  flex-shrink: 0;
}

.chapter-info {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.3;
  margin-bottom: 6px;
  font-size: 1.1em;
  word-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
}

.chapter-meta {
  font-size: 0.85em;
  color: var(--text-muted);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chapter-status {
  font-size: 20px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chapter-main-info {
    width: 100%;
  }

  .chapter-title {
    font-size: 1em;
    min-height: 2.4em;
  }

  .chapter-meta {
    flex-direction: column;
    gap: 4px;
  }

  .chapter-number {
    width: 32px;
    height: 32px;
    font-size: 0.9em;
  }

  .chapter-status {
    font-size: 18px;
    align-self: flex-end;
  }
}
</style>
