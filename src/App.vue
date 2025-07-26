<script setup lang="ts">
import { onMounted } from "vue";
import { useStudyTrackerStore } from "@/stores/counter";
import AppHeader from "@/components/AppHeader.vue";
import AppControls from "@/components/AppControls.vue";
import ProgressSummary from "@/components/ProgressSummary.vue";
import CurrentChapter from "@/components/CurrentChapter.vue";
import ChapterSummaryCard from "@/components/ChapterSummaryCard.vue";
import CelebrationModal from "@/components/CelebrationModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import ToastContainer from "@/components/ToastContainer.vue";

const store = useStudyTrackerStore();

onMounted(() => {
  store.initializeStore();
});
</script>

<template>
  <div class="app-container">
    <div class="container">
      <AppHeader />
      <AppControls />
      <ProgressSummary />
      <CurrentChapter />

      <main class="chapters">
        <h2 class="chapters-title text-center text-color font-bold">
          📋 All Chapters Overview
        </h2>
        <div class="chapters-grid grid-auto">
          <ChapterSummaryCard
            v-for="item in store.chapterProgressList"
            :key="item.id"
            :chapter="item"
            :progress="item.progress"
          />
        </div>
      </main>

      <CelebrationModal
        :show="store.celebrationModal.show"
        :message="store.celebrationModal.message"
        @close="store.hideCelebrationModal"
      />

      <ConfirmationModal
        :show="store.confirmationModal.show"
        :message="store.confirmationModal.message"
        @confirm="store.confirmAction"
        @close="store.hideConfirmationModal"
      />
    </div>

    <!-- Toast notifications for milestone celebrations -->
    <ToastContainer />
  </div>
</template>

<style>
@import "@/assets/study-tracker.css";

.app-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.chapters {
  padding: 30px;
  background: var(--darker-color);
}

.chapters-title {
  margin-bottom: 25px;
  font-size: 1.5em;
}

@media (max-width: 768px) {
  .chapters {
    padding: 20px;
  }

  .chapters-title {
    font-size: 1.3em;
    margin-bottom: 20px;
  }
}
</style>
