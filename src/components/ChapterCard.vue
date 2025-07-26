<template>
  <div class="chapter-card card card-hover" :class="{ 'card-completed': progress.completed }">
    <ChapterHeader :chapter="chapter" :progress="progress" />

    <div class="chapter-stats flex flex-gap-lg">
      <div class="stat">
        <span class="stat-label text-muted">Pages:</span>
        <span class="stat-value text-primary font-bold">{{ chapter.pages }}</span>
      </div>
      <div class="stat">
        <span class="stat-label text-muted">Problems:</span>
        <span class="stat-value text-primary font-bold">{{ chapter.problems }}</span>
      </div>
    </div>

    <div class="progress-section">
      <ProgressInput
        label="Pages Read"
        v-model="pagesRead"
        :max="chapter.pages"
        :show-percentage="true"
      />

      <ProgressInput
        label="Problems Solved"
        v-model="problemsSolved"
        :max="chapter.problems"
        :show-percentage="true"
      />

      <div class="checkbox-item card">
        <label class="flex flex-gap-sm">
          <input type="checkbox" :checked="progress.mcqCompleted" @change="updateMcqCompleted" />
          <span>MCQ Quiz Completed</span>
        </label>
      </div>
    </div>

    <div class="chapter-actions flex flex-gap-md">
      <button
        class="control-btn"
        :class="progress.completed ? 'danger' : 'achievement'"
        @click="toggleCompletion"
      >
        {{ progress.completed ? 'Mark Incomplete' : 'Mark Complete' }}
      </button>

      <button v-if="!progress.completed" class="control-btn secondary" @click="quickComplete">
        Quick Complete
      </button>
    </div>

    <div v-if="progress.completed && progress.completedDate" class="completion-date text-center text-light">
      Completed: {{ formatDate(progress.completedDate) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Chapter, ChapterProgress } from '@/types'
import { useStudyTrackerStore } from '@/stores/counter'
import ProgressInput from './ProgressInput.vue'
import ChapterHeader from './ChapterHeader.vue'

interface Props {
  chapter: Chapter
  progress: ChapterProgress
}

const props = defineProps<Props>()
const store = useStudyTrackerStore()

// Local reactive state for inputs
const pagesRead = ref(props.progress.pagesRead)
const problemsSolved = ref(props.progress.problemsSolved)

// Watch for changes in props and update local state
watch(() => props.progress.pagesRead, (newValue) => {
  pagesRead.value = newValue
})

watch(() => props.progress.problemsSolved, (newValue) => {
  problemsSolved.value = newValue
})

// Watch local state and update store
watch(pagesRead, (newValue) => {
  store.updateChapterProgress(props.chapter.id, { pagesRead: newValue })
})

watch(problemsSolved, (newValue) => {
  store.updateChapterProgress(props.chapter.id, { problemsSolved: newValue })
})

const updateMcqCompleted = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.updateChapterProgress(props.chapter.id, {
    mcqCompleted: target.checked,
  })
}

const toggleCompletion = () => {
  store.updateChapterProgress(props.chapter.id, {
    completed: !props.progress.completed,
    completedDate: !props.progress.completed ? new Date().toISOString() : undefined,
  })
}

const quickComplete = () => {
  store.updateChapterProgress(props.chapter.id, {
    pagesRead: props.chapter.pages,
    problemsSolved: props.chapter.problems,
    mcqCompleted: true,
    completed: true,
    completedDate: new Date().toISOString(),
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.chapter-card {
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.chapter-card.card-completed::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px 0;
  border-color: transparent var(--secondary-color) transparent transparent;
}

.chapter-card.card-completed::after {
  content: '✓';
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.chapter-stats {
  padding: 10px;
  background: var(--input-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.stat {
  display: flex;
  gap: 5px;
}

.progress-section {
  margin-bottom: 20px;
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
  font-size: 0.9em;
}

.checkbox-item input[type="checkbox"] {
  transform: scale(1.1);
}

.chapter-actions {
  justify-content: center;
  flex-wrap: wrap;
}

.completion-date {
  margin-top: 15px;
  padding: 10px;
  background: var(--input-bg);
  border-radius: 8px;
  font-size: 0.8em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chapter-card {
    padding: 15px;
  }

  .chapter-stats {
    flex-direction: column;
    gap: 10px;
  }

  .chapter-actions {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
