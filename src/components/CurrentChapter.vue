<template>
  <section class="current-chapter" v-if="currentChapter">
    <h2>📚 Currently Working On</h2>

    <div class="current-chapter-card">
      <div class="chapter-header">
        <div class="chapter-number">{{ currentChapter.id }}</div>
        <div class="chapter-info">
          <h3 class="chapter-title">{{ currentChapter.title }}</h3>
          <div class="chapter-meta">
            <span>{{ currentChapter.pages }} pages</span>
            <span>{{ currentChapter.problems }} problems</span>
          </div>
        </div>
        <div class="chapter-actions">
          <button
            v-if="!currentChapter.progress.startDate"
            class="control-btn achievement"
            @click="startChapter"
          >
            🚀 Start Chapter
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
      </div>

      <!-- Overall Chapter Progress -->
      <div class="chapter-overall-progress" v-if="currentChapter.progress.startDate">
        <h4>📊 Overall Chapter Progress</h4>
        <ProgressBar
          :percentage="chapterOverallProgress"
          variant="chapter"
          height="25px"
          :animated="true"
        />
        <div class="overall-progress-text">
          {{ chapterOverallProgress }}% Complete • {{ estimatedTimeRemaining }} remaining
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-item">
          <label>Pages Read:</label>
          <div class="progress-controls">
            <input
              type="number"
              :value="currentChapter.progress.pagesRead"
              @input="updatePagesRead"
              :max="currentChapter.pages"
              min="0"
              class="progress-input"
            />
            <span class="progress-total">/ {{ currentChapter.pages }}</span>
          </div>
          <ProgressBar
            :percentage="(currentChapter.progress.pagesRead / currentChapter.pages) * 100"
            variant="chapter"
            height="18px"
            :animated="true"
          />
          <div class="progress-percentage">
            {{ Math.round((currentChapter.progress.pagesRead / currentChapter.pages) * 100) }}%
            Complete
          </div>
        </div>

        <div class="progress-item">
          <label>Problems Solved:</label>
          <div class="progress-controls">
            <input
              type="number"
              :value="currentChapter.progress.problemsSolved"
              @input="updateProblemsSolved"
              :max="currentChapter.problems"
              min="0"
              class="progress-input"
            />
            <span class="progress-total">/ {{ currentChapter.problems }}</span>
          </div>
          <ProgressBar
            :percentage="(currentChapter.progress.problemsSolved / currentChapter.problems) * 100"
            variant="chapter"
            height="18px"
            :animated="true"
          />
          <div class="progress-percentage">
            {{
              Math.round((currentChapter.progress.problemsSolved / currentChapter.problems) * 100)
            }}% Complete
          </div>
        </div>

        <div class="checkbox-item">
          <label>
            <input
              type="checkbox"
              :checked="currentChapter.progress.mcqCompleted"
              @change="updateMcqCompleted"
            />
            MCQ Quiz Completed
          </label>
        </div>
      </div>

      <div class="chapter-actions-bottom">
        <button
          class="control-btn finish-chapter"
          :class="{
            enabled: isChapterFullyCompleted,
            disabled: !isChapterFullyCompleted,
          }"
          :disabled="!isChapterFullyCompleted"
          @click="finishChapter"
        >
          {{ currentChapter.progress.completed ? '✅ Chapter Completed' : '🎯 Finish Chapter' }}
        </button>
      </div>

      <div v-if="currentChapter.progress.startDate" class="start-date">
        Started: {{ formatDate(currentChapter.progress.startDate) }}
      </div>

      <div
        v-if="currentChapter.progress.completed && currentChapter.progress.completedDate"
        class="completion-date"
      >
        Completed: {{ formatDate(currentChapter.progress.completedDate) }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStudyTrackerStore } from '@/stores/counter'
import ProgressBar from './ProgressBar.vue'

const store = useStudyTrackerStore()

const currentChapter = computed(() => store.currentChapter)

// Computed property for overall chapter progress
const chapterOverallProgress = computed(() => {
  if (!currentChapter.value) return 0

  const settings = store.studySettings
  const progress = currentChapter.value.progress
  const chapter = currentChapter.value

  // Calculate total estimated time for the chapter
  const readingTime = chapter.pages * settings.readingSpeed // minutes
  const problemTime = chapter.problems * settings.problemTime // minutes
  const mcqTime = 40 // 40 minutes for MCQ
  const totalEstimatedTime = readingTime + problemTime + mcqTime

  // Calculate completed time
  const completedReadingTime = progress.pagesRead * settings.readingSpeed
  const completedProblemTime = progress.problemsSolved * settings.problemTime
  const completedMcqTime = progress.mcqCompleted ? mcqTime : 0
  const totalCompletedTime = completedReadingTime + completedProblemTime + completedMcqTime

  return Math.min(Math.round((totalCompletedTime / totalEstimatedTime) * 100), 100)
})

// Computed property for estimated time remaining
const estimatedTimeRemaining = computed(() => {
  if (!currentChapter.value) return ''

  const settings = store.studySettings
  const progress = currentChapter.value.progress
  const chapter = currentChapter.value

  const remainingPages = chapter.pages - progress.pagesRead
  const remainingProblems = chapter.problems - progress.problemsSolved
  const remainingMcq = progress.mcqCompleted ? 0 : 40

  const remainingTime =
    remainingPages * settings.readingSpeed + remainingProblems * settings.problemTime + remainingMcq

  if (remainingTime <= 0) return 'Chapter Complete!'

  const hours = Math.floor(remainingTime / 60)
  const minutes = remainingTime % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
})

// Computed property to check if chapter is fully completed
const isChapterFullyCompleted = computed(() => {
  if (!currentChapter.value) return false

  const progress = currentChapter.value.progress
  const chapter = currentChapter.value

  return (
    progress.pagesRead === chapter.pages &&
    progress.problemsSolved === chapter.problems &&
    progress.mcqCompleted
  )
})

const startChapter = () => {
  const chapterId = currentChapter.value?.id
  if (!chapterId) return

  store.updateChapterProgress(chapterId, {
    startDate: new Date().toISOString(),
  })
}

const finishChapter = () => {
  const chapterId = currentChapter.value?.id
  if (!chapterId || !isChapterFullyCompleted.value) return

  store.updateChapterProgress(chapterId, {
    completed: true,
    completedDate: new Date().toISOString(),
  })
}

const updatePagesRead = (event: Event) => {
  const target = event.target as HTMLInputElement
  const chapterId = currentChapter.value?.id
  if (!chapterId) return

  const value = Math.min(parseInt(target.value) || 0, currentChapter.value.pages)
  store.updateChapterProgress(chapterId, {
    pagesRead: value,
    completed:
      value === currentChapter.value.pages &&
      currentChapter.value.progress.problemsSolved === currentChapter.value.problems &&
      currentChapter.value.progress.mcqCompleted,
  })
}

const updateProblemsSolved = (event: Event) => {
  const target = event.target as HTMLInputElement
  const chapterId = currentChapter.value?.id
  if (!chapterId) return

  const value = Math.min(parseInt(target.value) || 0, currentChapter.value.problems)
  store.updateChapterProgress(chapterId, {
    problemsSolved: value,
    completed:
      currentChapter.value.progress.pagesRead === currentChapter.value.pages &&
      value === currentChapter.value.problems &&
      currentChapter.value.progress.mcqCompleted,
  })
}

const updateMcqCompleted = (event: Event) => {
  const target = event.target as HTMLInputElement
  const chapterId = currentChapter.value?.id
  if (!chapterId) return

  store.updateChapterProgress(chapterId, {
    mcqCompleted: target.checked,
    completed:
      currentChapter.value.progress.pagesRead === currentChapter.value.pages &&
      currentChapter.value.progress.problemsSolved === currentChapter.value.problems &&
      target.checked,
  })
}

const selectPreviousChapter = () => {
  if (currentChapter.value && currentChapter.value.id > 1) {
    store.setCurrentChapter(currentChapter.value.id - 1)
  }
}

const selectNextChapter = () => {
  if (currentChapter.value && currentChapter.value.id < 30) {
    store.setCurrentChapter(currentChapter.value.id + 1)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.current-chapter {
  background: var(--light-bg);
  padding: 30px;
  border-bottom: 1px solid var(--border-color);
}

.current-chapter h2 {
  color: var(--text-color);
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5em;
}

.current-chapter-card {
  background: var(--card-bg);
  border: 2px solid var(--accent-color);
  border-radius: var(--border-radius);
  padding: 25px;
  box-shadow: 0 0 20px rgba(243, 156, 18, 0.3);
  position: relative;
}

.chapter-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 25px;
}

.chapter-number {
  background: var(--accent-color);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3em;
  flex-shrink: 0;
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.chapter-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9em;
  color: var(--text-muted);
}

.chapter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chapter-overall-progress {
  background: var(--input-bg);
  border: 2px solid var(--accent-color);
  border-radius: var(--border-radius);
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
  text-align: center;
  color: var(--text-light);
  font-size: 0.9em;
  font-weight: 500;
  margin-top: 10px;
}

.progress-section {
  margin-bottom: 25px;
}

.progress-item {
  margin-bottom: 20px;
}

.progress-item label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-light);
  font-weight: 500;
  font-size: 1em;
}

.progress-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-input {
  width: 100px;
  padding: 8px 12px;
  font-size: 1em;
  font-weight: 600;
}

.progress-total {
  color: var(--text-muted);
  font-size: 1em;
  font-weight: 500;
}

.progress-percentage {
  font-size: 0.85em;
  color: var(--primary-color);
  font-weight: 600;
  text-align: right;
}

.checkbox-item {
  margin-top: 20px;
  padding: 15px;
  background: var(--input-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-light);
  font-size: 1em;
  margin-bottom: 0;
}

.checkbox-item input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.chapter-actions-bottom {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.chapter-actions-bottom .control-btn {
  flex: 1;
  min-width: 150px;
  padding: 12px 20px;
  font-size: 1em;
}

.finish-chapter {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.finish-chapter.enabled {
  background: linear-gradient(45deg, var(--secondary-color), #45b7d1);
  box-shadow:
    0 4px 15px rgba(88, 214, 141, 0.4),
    0 0 20px rgba(88, 214, 141, 0.2);
  animation: finish-button-glow 2s ease-in-out infinite;
}

.finish-chapter.enabled:hover {
  background: linear-gradient(45deg, #4fd687, #39a9c7);
  box-shadow:
    0 6px 25px rgba(88, 214, 141, 0.6),
    0 0 30px rgba(88, 214, 141, 0.4);
  transform: translateY(-2px) scale(1.02);
}

.finish-chapter.disabled {
  background: var(--input-bg);
  color: var(--text-muted);
  border: 2px solid var(--border-color);
  cursor: not-allowed;
  opacity: 0.6;
}

.finish-chapter.enabled::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.finish-chapter.enabled:hover::before {
  left: 100%;
}

@keyframes finish-button-glow {
  0%,
  100% {
    box-shadow:
      0 4px 15px rgba(88, 214, 141, 0.4),
      0 0 20px rgba(88, 214, 141, 0.2);
  }
  50% {
    box-shadow:
      0 4px 15px rgba(88, 214, 141, 0.6),
      0 0 30px rgba(88, 214, 141, 0.4);
  }
}

.start-date,
.completion-date {
  padding: 10px 15px;
  background: var(--input-bg);
  border-radius: 8px;
  font-size: 0.9em;
  color: var(--text-muted);
  text-align: center;
  border: 1px solid var(--border-color);
  margin-top: 10px;
}

.completion-date {
  background: linear-gradient(135deg, var(--input-bg), rgba(88, 214, 141, 0.1));
  color: var(--secondary-color);
  border-color: var(--secondary-color);
}

@media (max-width: 768px) {
  .current-chapter {
    padding: 20px;
  }

  .current-chapter-card {
    padding: 20px;
  }

  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .chapter-actions {
    width: 100%;
    justify-content: space-between;
  }

  .chapter-actions-bottom {
    flex-direction: column;
  }

  .chapter-actions-bottom .control-btn {
    min-width: auto;
  }

  .chapter-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
