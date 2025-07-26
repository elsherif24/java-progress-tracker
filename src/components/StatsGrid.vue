<template>
  <div class="stats-grid grid-auto">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="stat-card card card-hover"
      :class="stat.variant"
    >
      <h3 class="stat-label">{{ stat.label }}</h3>
      <div class="stat-number">{{ stat.value }}</div>
      <div v-if="stat.subtitle" class="stat-subtitle">{{ stat.subtitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stat {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "info" | "streak";
}

interface Props {
  stats: Stat[];
}

defineProps<Props>();
</script>

<style scoped>
.stats-grid {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.stat-card {
  padding: 20px;
  text-align: center;
}

.stat-card.success {
  border-color: var(--secondary-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(88, 214, 141, 0.1) 100%
  );
}

.stat-card.streak {
  border-color: #ff6b35;
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(255, 107, 53, 0.15) 50%,
    rgba(255, 193, 7, 0.1) 100%
  );
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
}

.stat-card.warning {
  border-color: var(--accent-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(243, 156, 18, 0.1) 100%
  );
}

.stat-card.info {
  border-color: var(--primary-color);
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(93, 173, 226, 0.1) 100%
  );
}

.stat-label {
  font-size: 0.9em;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-weight: 600;
}

.stat-number {
  font-size: 2.5em;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-card.streak .stat-number {
  color: #ff6b35;
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
}

.stat-subtitle {
  font-size: 0.8em;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .stat-card {
    padding: 15px;
  }

  .stat-number {
    font-size: 2em;
  }
}
</style>
