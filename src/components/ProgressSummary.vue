<template>
  <section class="overall-progress">
    <div class="progress-summary">
      <div class="summary-card">
        <h3>Chapters Completed</h3>
        <div class="number">{{ overallProgress.chaptersCompleted }}</div>
        <div>of 30</div>
      </div>
      <div class="summary-card">
        <h3>Total Pages Read</h3>
        <div class="number">{{ overallProgress.totalPagesRead }}</div>
        <div>of 1155</div>
      </div>
      <div class="summary-card">
        <h3>Problems Solved</h3>
        <div class="number">{{ overallProgress.totalProblems }}</div>
        <div>of 703</div>
      </div>
      <div class="summary-card">
        <h3>Overall Progress</h3>
        <div class="number">{{ overallProgress.overallPercent }}%</div>
      </div>
      <div class="summary-card study-streak" :data-has-streak="streakData.currentStreak > 0">
        <h3>🔥 Study Streak</h3>
        <div class="number streak-number">{{ streakData.currentStreak }}</div>
        <div>days</div>
      </div>
    </div>

    <ProgressBar
      :percentage="overallProgress.overallPercent"
      variant="default"
      height="40px"
      :animated="true"
    />

    <div class="time-estimate">
      <h4>⏱️ Study Time Estimates</h4>
      <div class="study-settings">
        <div class="settings-grid">
          <div class="study-hours-input">
            <label for="dailyHours">Daily Study Hours:</label>
            <input
              id="dailyHours"
              type="number"
              :value="studySettings.dailyHours"
              @input="updateDailyHours"
              min="0.5"
              max="12"
              step="0.5"
            />
          </div>
          <div class="study-hours-input">
            <label for="readingSpeed">Reading Speed (min/page):</label>
            <input
              id="readingSpeed"
              type="number"
              :value="studySettings.readingSpeed"
              @input="updateReadingSpeed"
              min="1"
              max="30"
              step="0.5"
            />
          </div>
          <div class="study-hours-input">
            <label for="problemTime">Problem Time (min/problem):</label>
            <input
              id="problemTime"
              type="number"
              :value="studySettings.problemTime"
              @input="updateProblemTime"
              min="1"
              max="60"
              step="1"
            />
          </div>
        </div>
      </div>
      <div class="time-info">
        <div>
          📖 <strong>Reading:</strong> <span>{{ timeEstimates.readingTime }} hours</span>
        </div>
        <div>
          🧩 <strong>Problems:</strong> <span>{{ timeEstimates.problemTime }} hours</span>
        </div>
        <div>
          ⏰ <strong>Total Est:</strong> <span>{{ timeEstimates.totalTime }} hours</span>
        </div>
        <div>
          🎯 <strong>Completion:</strong> <span>{{ timeEstimates.completionDate }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStudyTrackerStore } from '@/stores/counter'
import ProgressBar from './ProgressBar.vue'

const store = useStudyTrackerStore()

const overallProgress = computed(() => store.overallProgress)
const streakData = computed(() => store.streakData)
const studySettings = computed(() => store.studySettings)
const timeEstimates = computed(() => store.timeEstimates)

const updateDailyHours = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.updateStudySettings({ dailyHours: parseFloat(target.value) })
}

const updateReadingSpeed = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.updateStudySettings({ readingSpeed: parseFloat(target.value) })
}

const updateProblemTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.updateStudySettings({ problemTime: parseFloat(target.value) })
}
</script>

<style scoped>
.overall-progress {
  background: var(--light-bg);
  padding: 30px;
  border-bottom: 1px solid var(--border-color);
}

.progress-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: var(--border-radius);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.summary-card h3 {
  font-size: 0.9em;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-weight: 600;
}

.summary-card .number {
  font-size: 2.5em;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.study-streak .number {
  color: var(--accent-color);
}

/* Dynamic streak card styling */
.study-streak[data-has-streak='true'] {
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.15) 0%,
    rgba(255, 179, 71, 0.15) 50%,
    rgba(255, 140, 0, 0.15) 100%
  );
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow:
    0 5px 15px rgba(255, 215, 0, 0.3),
    0 0 30px rgba(255, 215, 0, 0.2);
}

.study-streak[data-has-streak='true']:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 25px rgba(255, 215, 0, 0.4),
    0 0 40px rgba(255, 215, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.6);
}

.study-streak[data-has-streak='false'] {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

/* Dynamic streak number styling */
.streak-number {
  transition: var(--transition);
}

.study-streak[data-has-streak='true'] .streak-number {
  background: linear-gradient(45deg, #ffd700, #ffb347, #ff8c00, #ffd700);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: flame-glow 3s ease-in-out infinite;
  text-shadow:
    0 0 20px rgba(255, 215, 0, 0.8),
    0 0 40px rgba(255, 140, 0, 0.6),
    0 0 60px rgba(255, 165, 0, 0.4);
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
}

.study-streak[data-has-streak='false'] .streak-number {
  color: var(--text-muted);
  text-shadow: none;
  filter: none;
}

@keyframes flame-glow {
  0%,
  100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) brightness(1);
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 25px rgba(255, 140, 0, 1)) brightness(1.3);
  }
}

.study-streak {
  position: relative;
  overflow: visible;
}

.study-streak[data-has-streak='true']::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: calc(var(--border-radius) + 2px);
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2));
  z-index: -1;
  animation: streak-border-glow 4s ease-in-out infinite;
}

@keyframes streak-border-glow {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.01);
  }
}

.time-estimate {
  background: var(--card-bg);
  padding: 25px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.time-estimate h4 {
  margin-bottom: 20px;
  color: var(--text-color);
  font-size: 1.1em;
}

.study-settings {
  margin-bottom: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.study-hours-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.study-hours-input label {
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.9em;
}

.time-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.time-info div {
  padding: 10px;
  background: var(--input-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.time-info strong {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .overall-progress {
    padding: 20px;
  }

  .progress-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .summary-card {
    padding: 15px;
  }

  .summary-card .number {
    font-size: 2em;
  }

  .settings-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .progress-summary {
    grid-template-columns: 1fr;
  }

  .time-info {
    grid-template-columns: 1fr;
  }
}
</style>
