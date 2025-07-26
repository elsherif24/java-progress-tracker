<template>
  <div
    class="chapter-summary-card card card-hover"
    :class="{
      'card-completed': progress.completed,
      'card-current': isCurrent,
      'card-celebration-glow': progress.completed,
    }"
    @click="setAsCurrent"
  >
    <ChapterHeader
      :chapter="chapter"
      :progress="progress"
      :is-current="isCurrent"
    />

    <div class="progress-info">
      <div v-if="progress.completed" class="completion-status">
        <div class="badge badge-success">✅ Completed</div>
      </div>
      <div
        v-else-if="
          progress.pagesRead > 0 ||
          progress.problemsSolved > 0 ||
          progress.mcqCompleted
        "
        class="progress-status"
      >
        <ProgressBar
          :percentage="chapterProgress"
          variant="mini"
          :show-text="false"
        />
        <div class="progress-percentage text-primary font-bold">
          {{ chapterProgress }}% Complete
        </div>
      </div>
      <div v-else class="not-started-status">
        <div class="badge badge-muted">📖 Not Started</div>
      </div>

      <div
        class="dates-info"
        v-if="progress.startDate || progress.completedDate"
      >
        <div v-if="progress.startDate" class="date-item flex flex-gap-sm">
          <span class="date-label text-muted">Started:</span>
          <span class="date-value text-light">{{
            formatDate(progress.startDate)
          }}</span>
        </div>
        <div v-if="progress.completedDate" class="date-item flex flex-gap-sm">
          <span class="date-label text-muted">Completed:</span>
          <span class="date-value text-light">{{
            formatDate(progress.completedDate)
          }}</span>
        </div>
      </div>
    </div>

    <div class="current-indicator badge badge-warning" v-if="isCurrent">
      Currently Working On
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chapter, ChapterProgress } from "@/types";
import { useStudyTrackerStore } from "@/stores/counter";
import { computed } from "vue";
import ProgressBar from "./ProgressBar.vue";
import ChapterHeader from "./ChapterHeader.vue";

interface Props {
  chapter: Chapter;
  progress: ChapterProgress;
}

const props = defineProps<Props>();
const store = useStudyTrackerStore();

const isCurrent = computed(() => store.currentChapterId === props.chapter.id);

// Calculate chapter progress percentage
const chapterProgress = computed(() => {
  const settings = store.studySettings;
  const progress = props.progress;
  const chapter = props.chapter;

  // Calculate total estimated time for the chapter
  const readingTime = chapter.pages * settings.readingSpeed; // minutes
  const problemTime = chapter.problems * settings.problemTime; // minutes
  const mcqTime = 40; // 40 minutes for MCQ
  const totalEstimatedTime = readingTime + problemTime + mcqTime;

  // Calculate completed time
  const completedReadingTime = progress.pagesRead * settings.readingSpeed;
  const completedProblemTime = progress.problemsSolved * settings.problemTime;
  const completedMcqTime = progress.mcqCompleted ? mcqTime : 0;
  const totalCompletedTime =
    completedReadingTime + completedProblemTime + completedMcqTime;

  return Math.min(
    Math.round((totalCompletedTime / totalEstimatedTime) * 100),
    100,
  );
});

const setAsCurrent = () => {
  store.setCurrentChapter(props.chapter.id);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.chapter-summary-card {
  padding: 20px;
  cursor: pointer;
  position: relative;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.chapter-summary-card:hover {
  border-color: var(--primary-color);
}

.card-celebration-glow {
  border-color: var(--secondary-color);
  box-shadow:
    0 0 20px rgba(88, 214, 141, 0.4),
    0 0 40px rgba(88, 214, 141, 0.2),
    inset 0 0 20px rgba(88, 214, 141, 0.1);
  animation: celebration-pulse 3s ease-in-out infinite;
}

@keyframes celebration-pulse {
  0%,
  100% {
    box-shadow:
      0 0 20px rgba(88, 214, 141, 0.4),
      0 0 40px rgba(88, 214, 141, 0.2),
      inset 0 0 20px rgba(88, 214, 141, 0.1);
  }
  50% {
    box-shadow:
      0 0 30px rgba(88, 214, 141, 0.6),
      0 0 60px rgba(88, 214, 141, 0.3),
      inset 0 0 30px rgba(88, 214, 141, 0.15);
  }
}

.progress-info {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-grow: 1;
}

.dates-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8em;
  text-align: right;
}

.current-indicator {
  position: absolute;
  top: -10px;
  right: 15px;
  font-size: 0.7em;
  padding: 4px 8px;
}

@media (max-width: 768px) {
  .chapter-summary-card {
    padding: 15px;
    min-height: 180px;
  }

  .dates-info {
    text-align: left;
  }

  .current-indicator {
    position: static;
    margin-top: 10px;
    text-align: center;
  }
}
</style>
