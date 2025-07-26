export interface Chapter {
  id: number
  title: string
  pages: number
  problems: number
}

export interface ChapterProgress {
  id: number
  completed: boolean
  pagesRead: number
  problemsSolved: number
  completedDate?: string
  startDate?: string
  mcqCompleted: boolean
}

export interface StreakData {
  currentStreak: number
  lastActiveDate: string | null
  longestStreak: number
}

export interface StudySettings {
  dailyHours: number
  readingSpeed: number // minutes per page
  problemTime: number // minutes per problem
}

export interface ProgressData {
  [key: number]: ChapterProgress
}

export interface SoundSettings {
  enabled: boolean
}

export type SoundType = 'smallWin' | 'mediumWin' | 'bigWin' | 'biggestWin' | 'click'

export interface TimeEstimates {
  readingTime: number
  problemTime: number
  totalTime: number
  completionDate: string
}

export interface OverallProgress {
  chaptersCompleted: number
  totalPagesRead: number
  totalProblems: number
  overallPercent: number
}
