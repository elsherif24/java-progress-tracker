<template>
  <div class="chapter-card" :class="{ completed: progress.completed }">
    <div class="chapter-header">
      <div class="chapter-number">{{ chapter.id }}</div>
      <div class="chapter-title">{{ chapter.title }}</div>
      <div class="chapter-status">
        {{ progress.completed ? '✅' : '📖' }}
      </div>
    </div>

    <div class="chapter-stats">
      <div class="stat">
        <span class="stat-label">Pages:</span>
        <span class="stat-value">{{ chapter.pages }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Problems:</span>
        <span class="stat-value">{{ chapter.problems }}</span>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-item">
        <label>Pages Read:</label>
        <div class="progress-controls">
          <input
            type="number"
            :value="progress.pagesRead"
            @input="updatePagesRead"
            :max="chapter.pages"
            min="0"
            class="progress-input"
          />
          <span class="progress-total">/ {{ chapter.pages }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(progress.pagesRead / chapter.pages) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="progress-item">
        <label>Problems Solved:</label>
        <div class="progress-controls">
          <input
            type="number"
            :value="progress.problemsSolved"
            @input="updateProblemsSolved"
            :max="chapter.problems"
            min="0"
            class="progress-input"
          />
          <span class="progress-total">/ {{ chapter.problems }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(progress.problemsSolved / chapter.problems) * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="checkbox-item">
        <label>
          <input type="checkbox" :checked="progress.mcqCompleted" @change="updateMcqCompleted" />
          MCQ Quiz Completed
        </label>
      </div>
    </div>

    <div class="chapter-actions">
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

    <div v-if="progress.completed && progress.completedDate" class="completion-date">
      Completed: {{ formatDate(progress.completedDate) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chapter, ChapterProgress } from '@/types'
import { useStudyTrackerStore } from '@/stores/counter'

interface Props {
  chapter: Chapter
  progress: ChapterProgress
}

const props = defineProps<Props>()
const store = useStudyTrackerStore()

const updatePagesRead = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Math.min(parseInt(target.value) || 0, props.chapter.pages)
  store.updateChapterProgress(props.chapter.id, {
    pagesRead: value,
    completed:
      value === props.chapter.pages &&
      props.progress.problemsSolved === props.chapter.problems &&
      props.progress.mcqCompleted,
  })
}

const updateProblemsSolved = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Math.min(parseInt(target.value) || 0, props.chapter.problems)
  store.updateChapterProgress(props.chapter.id, {
    problemsSolved: value,
    completed:
      props.progress.pagesRead === props.chapter.pages &&
      value === props.chapter.problems &&
      props.progress.mcqCompleted,
  })
}

const updateMcqCompleted = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.updateChapterProgress(props.chapter.id, {
    mcqCompleted: target.checked,
    completed:
      props.progress.pagesRead === props.chapter.pages &&
      props.progress.problemsSolved === props.chapter.problems &&
      target.checked,
  })
}

const toggleCompletion = () => {
  if (props.progress.completed) {
    store.updateChapterProgress(props.chapter.id, {
      completed: false,
      pagesRead: 0,
      problemsSolved: 0,
      mcqCompleted: false,
      completedDate: undefined,
    })
  } else {
    store.updateChapterProgress(props.chapter.id, {
      completed: true,
      pagesRead: props.chapter.pages,
      problemsSolved: props.chapter.problems,
      mcqCompleted: true,
    })
  }
}

const quickComplete = () => {
  store.updateChapterProgress(props.chapter.id, {
    completed: true,
    pagesRead: props.chapter.pages,
    problemsSolved: props.chapter.problems,
    mcqCompleted: true,
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.chapter-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.chapter-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

.chapter-card.completed {
  border-color: var(--secondary-color);
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(88, 214, 141, 0.1) 100%);
}

.chapter-card.completed::before {
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

.chapter-card.completed::after {
  content: '✓';
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.chapter-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.chapter-number {
  background: var(--primary-color);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1em;
  flex-shrink: 0;
}

.chapter-title {
  flex: 1;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
}

.chapter-status {
  font-size: 24px;
  flex-shrink: 0;
}

.chapter-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background: var(--input-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat {
  display: flex;
  gap: 5px;
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9em;
}

.stat-value {
  color: var(--primary-color);
  font-weight: 600;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-item {
  margin-bottom: 15px;
}

.progress-item label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.9em;
}

.progress-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}

.progress-input {
  width: 80px;
  padding: 5px 8px;
  font-size: 0.9em;
}

.progress-total {
  color: var(--text-muted);
  font-size: 0.9em;
}

.progress-bar {
  height: 8px;
  background: var(--input-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.checkbox-item {
  margin-top: 15px;
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-light);
  font-size: 0.9em;
}

.checkbox-item input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
}

.chapter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chapter-actions .control-btn {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  font-size: 0.85em;
}

.completion-date {
  margin-top: 15px;
  padding: 8px 12px;
  background: var(--input-bg);
  border-radius: 6px;
  font-size: 0.8em;
  color: var(--text-muted);
  text-align: center;
  border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .chapter-card {
    padding: 15px;
  }

  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .chapter-stats {
    flex-direction: column;
    gap: 10px;
  }

  .chapter-actions {
    flex-direction: column;
  }

  .chapter-actions .control-btn {
    min-width: auto;
  }
}
</style>
