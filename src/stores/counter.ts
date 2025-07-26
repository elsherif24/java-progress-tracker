import { defineStore } from 'pinia'
import type {
  ProgressData,
  StreakData,
  StudySettings,
  ChapterProgress,
  OverallProgress,
  TimeEstimates,
} from '@/types'
import {
  CHAPTERS_DATA,
  TOTAL_PAGES,
  TOTAL_PROBLEMS,
  TOTAL_CHAPTERS,
  DEFAULT_SETTINGS,
} from '@/data/chapters'
import { soundService } from '@/services/soundService'

export const useStudyTrackerStore = defineStore('studyTracker', {
  state: () => ({
    progressData: {} as ProgressData,
    currentChapterId: 1, // ID of the chapter currently being worked on
    streakData: {
      currentStreak: 0,
      lastActiveDate: null,
      longestStreak: 0,
    } as StreakData,
    studySettings: {
      dailyHours: DEFAULT_SETTINGS.DEFAULT_DAILY_HOURS,
      readingSpeed: DEFAULT_SETTINGS.AVERAGE_READING_SPEED,
      problemTime: DEFAULT_SETTINGS.AVERAGE_PROBLEM_TIME,
    } as StudySettings,
    celebrationModal: {
      show: false,
      message: '',
    },
    confirmationModal: {
      show: false,
      message: '',
      onConfirm: null as (() => void) | null,
    },
  }),

  getters: {
    overallProgress(): OverallProgress {
      const chapters = Object.values(this.progressData)
      const chaptersCompleted = chapters.filter((ch) => ch.completed).length
      const totalPagesRead = chapters.reduce((sum, ch) => sum + ch.pagesRead, 0)
      const totalProblems = chapters.reduce((sum, ch) => sum + ch.problemsSolved, 0)
      const overallPercent = Math.round((chaptersCompleted / TOTAL_CHAPTERS) * 100)

      return {
        chaptersCompleted,
        totalPagesRead,
        totalProblems,
        overallPercent,
      }
    },

    timeEstimates(): TimeEstimates {
      const { overallProgress } = this
      const remainingPages = TOTAL_PAGES - overallProgress.totalPagesRead
      const remainingProblems = TOTAL_PROBLEMS - overallProgress.totalProblems

      const readingTime = Math.round((remainingPages * this.studySettings.readingSpeed) / 60)
      const problemTime = Math.round((remainingProblems * this.studySettings.problemTime) / 60)
      const totalTime = readingTime + problemTime

      const daysToComplete = Math.ceil(totalTime / this.studySettings.dailyHours)
      const completionDate = new Date()
      completionDate.setDate(completionDate.getDate() + daysToComplete)

      return {
        readingTime,
        problemTime,
        totalTime,
        completionDate: daysToComplete > 0 ? completionDate.toLocaleDateString() : 'Completed!',
      }
    },

    chapterProgressList(): Array<{
      id: number
      title: string
      pages: number
      problems: number
      progress: ChapterProgress
    }> {
      return CHAPTERS_DATA.map((chapter) => ({
        ...chapter,
        progress: this.progressData[chapter.id] || {
          id: chapter.id,
          completed: false,
          pagesRead: 0,
          problemsSolved: 0,
          mcqCompleted: false,
        },
      }))
    },

    currentChapter(): {
      id: number
      title: string
      pages: number
      problems: number
      progress: ChapterProgress
    } | null {
      const chapter = CHAPTERS_DATA.find((ch) => ch.id === this.currentChapterId)
      if (!chapter) return null

      return {
        ...chapter,
        progress: this.progressData[chapter.id] || {
          id: chapter.id,
          completed: false,
          pagesRead: 0,
          problemsSolved: 0,
          mcqCompleted: false,
        },
      }
    },
  },

  actions: {
    initializeStore() {
      this.loadProgressData()
      this.loadStreakData()
      this.setCurrentChapterToFirstIncomplete()
    },

    setCurrentChapterToFirstIncomplete() {
      // Find the first incomplete chapter, or default to chapter 1
      for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
        const progress = this.progressData[i]
        if (!progress || !progress.completed) {
          this.currentChapterId = i
          return
        }
      }
      // If all chapters are complete, stay on the last chapter
      this.currentChapterId = TOTAL_CHAPTERS
    },

    loadProgressData() {
      const saved = localStorage.getItem('javaStudyProgress')
      if (saved) {
        this.progressData = JSON.parse(saved)
      }
    },

    saveProgressData() {
      localStorage.setItem('javaStudyProgress', JSON.stringify(this.progressData))
    },

    loadStreakData() {
      const saved = localStorage.getItem('javaStudyStreak')
      if (saved) {
        this.streakData = JSON.parse(saved)
      }
      this.updateStreak()
    },

    saveStreakData() {
      localStorage.setItem('javaStudyStreak', JSON.stringify(this.streakData))
    },

    updateStreak() {
      const today = new Date().toDateString()
      const lastDate = this.streakData.lastActiveDate

      if (!lastDate) {
        this.streakData.currentStreak = 1
        this.streakData.lastActiveDate = today
      } else if (lastDate !== today) {
        const lastActiveDate = new Date(lastDate)
        const daysSinceLastActive = Math.floor(
          (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24),
        )

        if (daysSinceLastActive === 1) {
          this.streakData.currentStreak++
        } else if (daysSinceLastActive > 1) {
          this.streakData.currentStreak = 1
        }

        this.streakData.lastActiveDate = today
      }

      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak
      }

      this.saveStreakData()
    },

    updateChapterProgress(chapterId: number, progress: Partial<ChapterProgress>) {
      if (!this.progressData[chapterId]) {
        this.progressData[chapterId] = {
          id: chapterId,
          completed: false,
          pagesRead: 0,
          problemsSolved: 0,
          mcqCompleted: false,
        }
      }

      const oldProgress = { ...this.progressData[chapterId] }
      this.progressData[chapterId] = { ...this.progressData[chapterId], ...progress }

      // Set start date if first progress is made
      if (
        !oldProgress.startDate &&
        (progress.pagesRead ||
          progress.problemsSolved ||
          progress.mcqCompleted ||
          progress.startDate)
      ) {
        this.progressData[chapterId].startDate = progress.startDate || new Date().toISOString()
      }

      // Handle completion
      if (progress.completed && !oldProgress.completed) {
        this.progressData[chapterId].completedDate = new Date().toISOString()
        this.updateStreak()
        this.celebrateCompletion(chapterId)

        // Auto-advance to next incomplete chapter
        this.setCurrentChapterToFirstIncomplete()
      }

      this.saveProgressData()
    },

    setCurrentChapter(chapterId: number) {
      if (chapterId >= 1 && chapterId <= TOTAL_CHAPTERS) {
        this.currentChapterId = chapterId
      }
    },

    celebrateCompletion(chapterId: number) {
      const chapter = CHAPTERS_DATA.find((ch) => ch.id === chapterId)
      if (!chapter) return

      const { chaptersCompleted } = this.overallProgress

      let soundType: 'smallWin' | 'mediumWin' | 'bigWin' | 'biggestWin' = 'smallWin'
      let message = `🎉 Chapter ${chapterId} completed: "${chapter.title}"!`

      if (chaptersCompleted === TOTAL_CHAPTERS) {
        soundType = 'biggestWin'
        message = '🏆 Congratulations! You have completed all chapters! You are now a Java master!'
      } else if (chaptersCompleted % 10 === 0) {
        soundType = 'bigWin'
        message = `🚀 Amazing! You've completed ${chaptersCompleted} chapters! Keep up the excellent work!`
      } else if (chaptersCompleted % 5 === 0) {
        soundType = 'mediumWin'
        message = `⭐ Great progress! ${chaptersCompleted} chapters completed!`
      }

      soundService.playSound(soundType)
      this.showCelebrationModal(message)
    },

    showCelebrationModal(message: string) {
      this.celebrationModal.show = true
      this.celebrationModal.message = message
    },

    hideCelebrationModal() {
      this.celebrationModal.show = false
      this.celebrationModal.message = ''
    },

    showConfirmationModal(message: string, onConfirm: () => void) {
      this.confirmationModal.show = true
      this.confirmationModal.message = message
      this.confirmationModal.onConfirm = onConfirm
    },

    hideConfirmationModal() {
      this.confirmationModal.show = false
      this.confirmationModal.message = ''
      this.confirmationModal.onConfirm = null
    },

    confirmAction() {
      if (this.confirmationModal.onConfirm) {
        this.confirmationModal.onConfirm()
      }
      this.hideConfirmationModal()
    },

    exportProgress() {
      const data = {
        progressData: this.progressData,
        streakData: this.streakData,
        exportDate: new Date().toISOString(),
        version: '2.0',
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `java-study-progress-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      this.showCelebrationModal('📊 Progress exported successfully!')
    },

    importProgress(file: File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (data.progressData) {
            this.progressData = data.progressData
            this.saveProgressData()
          }

          if (data.streakData) {
            this.streakData = data.streakData
            this.saveStreakData()
          }

          this.showCelebrationModal('📥 Progress imported successfully!')
        } catch {
          this.showCelebrationModal(
            '❌ Error importing progress file. Please check the file format.',
          )
        }
      }
      reader.readAsText(file)
    },

    resetProgress() {
      this.showConfirmationModal(
        'Are you sure you want to reset all progress? This action cannot be undone.',
        () => {
          this.progressData = {}
          this.streakData = {
            currentStreak: 0,
            lastActiveDate: null,
            longestStreak: 0,
          }
          localStorage.removeItem('javaStudyProgress')
          localStorage.removeItem('javaStudyStreak')
          this.showCelebrationModal('🔄 Progress reset successfully!')
        },
      )
    },

    updateStudySettings(settings: Partial<StudySettings>) {
      this.studySettings = { ...this.studySettings, ...settings }
    },
  },
})
