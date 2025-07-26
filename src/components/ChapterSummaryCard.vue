<template>
  <div
    class="chapter-summary-card"
    :class="{ completed: progress.completed, current: isCurrent }"
    @click="setAsCurrent"
  >
    <div class="chapter-header">
      <div class="chapter-number">{{ chapter.id }}</div>
      <div class="chapter-info">
        <div class="chapter-title">{{ chapter.title }}</div>
        <div class="chapter-stats">
          <span>{{ chapter.pages }} pages</span>
          <span>{{ chapter.problems }} problems</span>
        </div>
      </div>
      <div class="chapter-status">
        {{ progress.completed ? '✅' : isCurrent ? '📚' : '📖' }}
      </div>
    </div>

    <div class="progress-info">
      <div v-if="progress.completed" class="completion-status">
        <div class="completed-badge">✅ Completed</div>
      </div>
      <div
        v-else-if="progress.pagesRead > 0 || progress.problemsSolved > 0 || progress.mcqCompleted"
        class="progress-status"
      >
        <div class="progress-percentage">{{ chapterProgress }}% Complete</div>
        <ProgressBar :percentage="chapterProgress" variant="mini" height="8px" :animated="true" />
      </div>
      <div v-else class="not-started-status">
        <div class="not-started-badge">📖 Not Started</div>
      </div>

      <div class="dates-info" v-if="progress.startDate || progress.completedDate">
        <div v-if="progress.startDate" class="date-item">
          <span class="date-label">Started:</span>
          <span class="date-value">{{ formatDate(progress.startDate) }}</span>
        </div>
        <div v-if="progress.completedDate" class="date-item">
          <span class="date-label">Completed:</span>
          <span class="date-value">{{ formatDate(progress.completedDate) }}</span>
        </div>
      </div>
    </div>

    <div class="current-indicator" v-if="isCurrent">Currently Working On</div>
  </div>
</template>

<script setup lang="ts">
import type { Chapter, ChapterProgress } from '@/types'
import { useStudyTrackerStore } from '@/stores/counter'
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'

interface Props {
  chapter: Chapter
  progress: ChapterProgress
}

const props = defineProps<Props>()
const store = useStudyTrackerStore()

const isCurrent = computed(() => store.currentChapterId === props.chapter.id)

// Calculate chapter progress percentage
const chapterProgress = computed(() => {
  const settings = store.studySettings
  const progress = props.progress
  const chapter = props.chapter

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

const setAsCurrent = () => {
  if (!props.progress.completed) {
    store.setCurrentChapter(props.chapter.id)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.chapter-summary-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}

.chapter-summary-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

.chapter-summary-card.completed {
  border-color: var(--secondary-color);
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(88, 214, 141, 0.1) 100%);
  cursor: default;
}

.chapter-summary-card.completed:hover {
  transform: none;
  box-shadow: var(--shadow);
}

.chapter-summary-card.current {
  border-color: var(--accent-color);
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(243, 156, 18, 0.1) 100%);
  box-shadow: 0 0 20px rgba(243, 156, 18, 0.3);
}

.chapter-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
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

.chapter-summary-card.completed .chapter-number {
  background: var(--secondary-color);
}

.chapter-summary-card.current .chapter-number {
  background: var(--accent-color);
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 5px;
}

.chapter-stats {
  display: flex;
  gap: 15px;
  font-size: 0.85em;
  color: var(--text-muted);
}

.chapter-status {
  font-size: 24px;
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 15px;
}

.completion-status,
.progress-status,
.not-started-status {
  flex: 1;
}

.completed-badge {
  background: var(--secondary-color);
  color: white;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 600;
  text-align: center;
}

.not-started-badge {
  background: var(--input-bg);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--border-color);
}

.progress-percentage {
  color: var(--primary-color);
  font-size: 0.8em;
  font-weight: 600;
  margin-bottom: 5px;
  text-align: center;
}

.dates-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8em;
  text-align: right;
}

.date-item {
  display: flex;
  gap: 5px;
}

.date-label {
  color: var(--text-muted);
}

.date-value {
  color: var(--text-light);
  font-weight: 500;
}

.current-indicator {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(45deg, var(--accent-color), #ffa500);
  color: white;
  padding: 4px 12px;
  border-radius: 0 0 8px 8px;
  font-size: 0.7em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .chapter-summary-card {
    padding: 15px;
  }

  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .dates-info {
    text-align: left;
  }
}
</style>
