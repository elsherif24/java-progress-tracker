<template>
  <section class="current-chapter" v-if="currentChapter">
    <h2>📚 Currently Working On</h2>

    <div class="current-chapter-card card">
      <ChapterHeader
        :chapter="currentChapter"
        :progress="currentChapter.progress"
        :is-current="true"
      />

      <div class="chapter-actions flex flex-gap-md">
        <button
          v-if="!currentChapter.progress.startDate"
          class="control-btn achievement"
          @click="startChapter"
        >
          🚀 Start Chapter
        </button>
        <button
          v-if="isChapterFullyComplete && !currentChapter.progress.completed"
          class="control-btn achievement pulse-glow"
          @click="markChapterAsDone"
        >
          ✅ Mark as Done
        </button>
        <button
          class="control-btn secondary"
          @click="selectPreviousChapter"
          :disabled="currentChapter.id === 1"
        >
          ← Previous
        </button>
        <button
          class="control-btn secondary"
          @click="selectNextChapter"
          :disabled="currentChapter.id === 30"
        >
          Next →
        </button>
      </div>

      <!-- Overall Chapter Progress -->
      <div
        class="chapter-overall-progress card"
        v-if="currentChapter.progress.startDate"
      >
        <h4>📊 Overall Chapter Progress</h4>
        <ProgressBar
          :percentage="chapterOverallProgress"
          variant="chapter"
          :show-text="true"
        />
        <div class="overall-progress-text text-center text-light">
          {{ chapterOverallProgress }}% Complete •
          {{ estimatedTimeRemaining }} remaining
        </div>
      </div>

      <div class="progress-section">
        <ProgressInput
          label="Pages Read"
          v-model="pagesRead"
          :max="currentChapter.pages"
          :show-percentage="true"
        />

        <ProgressInput
          label="Problems Solved"
          v-model="problemsSolved"
          :max="currentChapter.problems"
          :show-percentage="true"
        />

        <div class="checkbox-item card">
          <label class="flex flex-gap-sm">
            <input
              type="checkbox"
              :checked="currentChapter.progress.mcqCompleted"
              @change="updateMcqCompleted"
            />
            <span>MCQ Quiz Completed</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStudyTrackerStore } from "@/stores/counter";
import ProgressBar from "./ProgressBar.vue";
import ProgressInput from "./ProgressInput.vue";
import ChapterHeader from "./ChapterHeader.vue";

const store = useStudyTrackerStore();

const currentChapter = computed(() => store.currentChapter);

// Local reactive state for inputs
const pagesRead = ref(0);
const problemsSolved = ref(0);

// Watch for changes in current chapter and update local state
watch(
  currentChapter,
  (newChapter) => {
    if (newChapter) {
      pagesRead.value = newChapter.progress.pagesRead;
      problemsSolved.value = newChapter.progress.problemsSolved;
    }
  },
  { immediate: true },
);

// Watch local state and update store
watch(pagesRead, (newValue) => {
  if (currentChapter.value) {
    store.updateChapterProgress(currentChapter.value.id, {
      pagesRead: newValue,
    });
  }
});

watch(problemsSolved, (newValue) => {
  if (currentChapter.value) {
    store.updateChapterProgress(currentChapter.value.id, {
      problemsSolved: newValue,
    });
  }
});

// Computed property for overall chapter progress
const chapterOverallProgress = computed(() => {
  if (!currentChapter.value) return 0;

  const settings = store.studySettings;
  const progress = currentChapter.value.progress;
  const chapter = currentChapter.value;

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

// Check if chapter is fully complete (all content done but not marked as done)
const isChapterFullyComplete = computed(() => {
  if (!currentChapter.value) return false;

  const progress = currentChapter.value.progress;
  const chapter = currentChapter.value;

  return (
    progress.pagesRead === chapter.pages &&
    progress.problemsSolved === chapter.problems &&
    progress.mcqCompleted &&
    !progress.completed
  );
});

const estimatedTimeRemaining = computed(() => {
  if (!currentChapter.value) return "0 min";

  const settings = store.studySettings;
  const progress = currentChapter.value.progress;
  const chapter = currentChapter.value;

  const remainingPages = chapter.pages - progress.pagesRead;
  const remainingProblems = chapter.problems - progress.problemsSolved;
  const remainingMcq = progress.mcqCompleted ? 0 : 1;

  const remainingTime =
    remainingPages * settings.readingSpeed +
    remainingProblems * settings.problemTime +
    remainingMcq * 40;

  const hours = Math.floor(remainingTime / 60);
  const minutes = remainingTime % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
});

const startChapter = () => {
  if (currentChapter.value) {
    store.updateChapterProgress(currentChapter.value.id, {
      startDate: new Date().toISOString(),
    });
  }
};

const selectPreviousChapter = () => {
  if (currentChapter.value && currentChapter.value.id > 1) {
    store.setCurrentChapter(currentChapter.value.id - 1);
  }
};

const selectNextChapter = () => {
  if (currentChapter.value && currentChapter.value.id < 30) {
    store.setCurrentChapter(currentChapter.value.id + 1);
  }
};

const updateMcqCompleted = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (currentChapter.value) {
    store.updateChapterProgress(currentChapter.value.id, {
      mcqCompleted: target.checked,
    });
  }
};

const markChapterAsDone = () => {
  if (currentChapter.value) {
    // Mark chapter as completed
    store.updateChapterProgress(currentChapter.value.id, {
      completed: true,
      completedDate: new Date().toISOString(),
    });

    // Celebration is already handled in store.updateChapterProgress()
  }
};
</script>

<style scoped>
.current-chapter {
  padding: 30px;
  background: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
}

.current-chapter h2 {
  color: var(--text-color);
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.5em;
  font-weight: 600;
}

.current-chapter-card {
  padding: 30px;
  width: 100%;
  margin: 0;
}

.chapter-actions {
  margin-bottom: 25px;
  justify-content: center;
  flex-wrap: wrap;
}

.chapter-overall-progress {
  background: var(--input-bg);
  border: 2px solid var(--accent-color);
  padding: 20px;
  margin-bottom: 25px;
}

.chapter-overall-progress h4 {
  color: var(--accent-color);
  margin-bottom: 15px;
  font-size: 1.1em;
  font-weight: 600;
}

.overall-progress-text {
  font-size: 0.9em;
  font-weight: 500;
  margin-top: 10px;
}

.progress-section {
  margin-bottom: 25px;
}

.checkbox-item {
  margin-top: 20px;
  padding: 15px;
  background: var(--input-bg);
}

.checkbox-item label {
  cursor: pointer;
  color: var(--text-light);
  font-weight: 500;
  font-size: 1em;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}

.pulse-glow {
  animation: pulse-glow-effect 2s ease-in-out infinite;
}

@keyframes pulse-glow-effect {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(88, 214, 141, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6px 25px rgba(88, 214, 141, 0.7);
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  .current-chapter {
    padding: 20px;
  }

  .current-chapter-card {
    padding: 20px;
  }

  .current-chapter h2 {
    font-size: 1.3em;
    margin-bottom: 20px;
  }

  .chapter-actions {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
