<template>
  <section class="overall-progress">
    <StatsGrid :stats="summaryStats" />

    <ProgressBar
      :percentage="overallProgress.overallPercent"
      variant="overall"
      :show-text="true"
    />

    <div class="time-estimate card">
      <h4>⏱️ Study Time Estimates</h4>

      <!-- Settings Section -->
      <div class="study-settings">
        <div class="settings-row">
          <div class="study-input-group">
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
          <div class="study-input-group">
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
          <div class="study-input-group">
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

      <!-- Time Estimates Section -->
      <div class="time-estimates">
        <div class="time-stats-row">
          <div class="time-stat">
            <div class="stat-icon">📖</div>
            <div class="stat-content">
              <div class="stat-label">Reading</div>
              <div class="stat-value">{{ timeEstimates.readingTime }}h</div>
            </div>
          </div>
          <div class="time-stat">
            <div class="stat-icon">🧩</div>
            <div class="stat-content">
              <div class="stat-label">Problems</div>
              <div class="stat-value">{{ timeEstimates.problemTime }}h</div>
            </div>
          </div>
          <div class="time-stat">
            <div class="stat-icon">⏰</div>
            <div class="stat-content">
              <div class="stat-label">Total</div>
              <div class="stat-value">{{ timeEstimates.totalTime }}h</div>
            </div>
          </div>
          <div class="time-stat completion-stat">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-label">Completion</div>
              <div class="stat-value">{{ timeEstimates.completionDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStudyTrackerStore } from "@/stores/counter";
import ProgressBar from "./ProgressBar.vue";
import StatsGrid from "./StatsGrid.vue";

const store = useStudyTrackerStore();

const overallProgress = computed(() => store.overallProgress);
const streakData = computed(() => store.streakData);
const studySettings = computed(() => store.studySettings);
const timeEstimates = computed(() => store.timeEstimates);

// Create stats array for StatsGrid component
const summaryStats = computed(() => [
  {
    label: "Chapters Completed",
    value: overallProgress.value.chaptersCompleted,
    subtitle: "of 30",
    variant: "success" as const,
  },
  {
    label: "Total Pages Read",
    value: overallProgress.value.totalPagesRead,
    subtitle: "of 1155",
    variant: "info" as const,
  },
  {
    label: "Problems Solved",
    value: overallProgress.value.totalProblems,
    subtitle: "of 703",
    variant: "info" as const,
  },
  {
    label: "Overall Progress",
    value: `${overallProgress.value.overallPercent}%`,
    variant: "warning" as const,
  },
  {
    label: "🔥 Study Streak",
    value: streakData.value.currentStreak,
    subtitle: `day${streakData.value.currentStreak !== 1 ? "s" : ""}`,
    variant:
      streakData.value.currentStreak > 0
        ? ("streak" as const)
        : ("default" as const),
  },
]);

const updateDailyHours = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.updateStudySettings({ dailyHours: parseFloat(target.value) });
};

const updateReadingSpeed = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.updateStudySettings({ readingSpeed: parseFloat(target.value) });
};

const updateProblemTime = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.updateStudySettings({ problemTime: parseFloat(target.value) });
};
</script>

<style scoped>
.overall-progress {
  background: var(--light-bg);
  padding: 30px;
  border-bottom: 1px solid var(--border-color);
}

.time-estimate {
  padding: 25px;
  margin-top: 20px;
}

.time-estimate h4 {
  margin-bottom: 20px;
  color: var(--text-color);
  font-size: 1.1em;
}

.study-settings {
  margin-bottom: 20px;
}

.settings-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 25px;
  justify-content: center;
}

.study-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.study-input-group label {
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.85em;
}

.study-input-group input {
  background: var(--input-bg);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--text-color);
  font-size: 0.9em;
  transition: var(--transition);
  width: 100%;
}

.study-input-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 8px rgba(93, 173, 226, 0.3);
}

.time-estimates {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.time-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.time-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: var(--input-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.8em;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1em;
  color: var(--primary-color);
  font-weight: 600;
}

.completion-stat .stat-value {
  color: var(--secondary-color);
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .overall-progress {
    padding: 20px;
  }

  .settings-row {
    flex-direction: column;
    gap: 15px;
  }

  .study-input-group {
    min-width: auto;
  }

  .time-stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .time-estimate {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .time-stats-row {
    grid-template-columns: 1fr;
  }

  .settings-row {
    gap: 12px;
  }
}
</style>
