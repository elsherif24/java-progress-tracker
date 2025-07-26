import { computed } from 'vue'
import { useStudyTrackerStore } from '@/stores/counter'

/**
 * Composable for calculating chapter progress percentage
 */
export function useChapterProgress(chapterId: number) {
  const store = useStudyTrackerStore()

  const chapterProgress = computed(() => {
    const settings = store.studySettings
    const progressData = store.progressData[chapterId]
    const chapter = store.chapterProgressList.find(ch => ch.id === chapterId)

    if (!progressData || !chapter) return 0

    // Calculate total estimated time for the chapter
    const readingTime = chapter.pages * settings.readingSpeed // minutes
    const problemTime = chapter.problems * settings.problemTime // minutes
    const mcqTime = 40 // 40 minutes for MCQ
    const totalEstimatedTime = readingTime + problemTime + mcqTime

    // Calculate completed time
    const completedReadingTime = progressData.pagesRead * settings.readingSpeed
    const completedProblemTime = progressData.problemsSolved * settings.problemTime
    const completedMcqTime = progressData.mcqCompleted ? mcqTime : 0

    const totalCompletedTime = completedReadingTime + completedProblemTime + completedMcqTime

    return Math.min(Math.round((totalCompletedTime / totalEstimatedTime) * 100), 100)
  })

  return {
    chapterProgress
  }
}

/**
 * Composable for formatting dates consistently
 */
export function useDateFormatter() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return {
    formatDate,
    formatDateTime
  }
}

/**
 * Composable for time estimation calculations
 */
export function useTimeEstimation(chapterId: number) {
  const store = useStudyTrackerStore()

  const estimatedTimeRemaining = computed(() => {
    const settings = store.studySettings
    const progressData = store.progressData[chapterId]
    const chapter = store.chapterProgressList.find(ch => ch.id === chapterId)

    if (!progressData || !chapter) return '0 min'

    const remainingPages = chapter.pages - progressData.pagesRead
    const remainingProblems = chapter.problems - progressData.problemsSolved
    const remainingMcq = progressData.mcqCompleted ? 0 : 1

    const remainingTime = 
      remainingPages * settings.readingSpeed +
      remainingProblems * settings.problemTime +
      remainingMcq * 40

    const hours = Math.floor(remainingTime / 60)
    const minutes = remainingTime % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  })

  return {
    estimatedTimeRemaining
  }
}
