import type { Chapter } from '@/types'

export const CHAPTERS_DATA: Chapter[] = [
  { id: 1, title: 'Introduction to Computers, Programs, and Java™', pages: 32, problems: 13 },
  { id: 2, title: 'Elementary Programming', pages: 44, problems: 23 },
  { id: 3, title: 'Selections', pages: 44, problems: 34 },
  { id: 4, title: 'Mathematical Functions, Characters, and Strings', pages: 38, problems: 26 },
  { id: 5, title: 'Loops', pages: 46, problems: 51 },
  { id: 6, title: 'Methods', pages: 43, problems: 39 },
  { id: 7, title: 'Single-Dimensional Arrays', pages: 41, problems: 37 },
  { id: 8, title: 'Multidimensional Arrays', pages: 34, problems: 37 },
  { id: 9, title: 'Objects and Classes', pages: 44, problems: 13 },
  { id: 10, title: 'Object-Oriented Thinking', pages: 44, problems: 28 },
  { id: 11, title: 'Inheritance and Polymorphism', pages: 42, problems: 19 },
  { id: 12, title: 'Exception Handling and Text I/O', pages: 46, problems: 22 },
  { id: 13, title: 'Abstract Classes and Interfaces', pages: 42, problems: 21 },
  { id: 14, title: 'JavaFX Basics', pages: 52, problems: 29 },
  { id: 15, title: 'Event-Driven Programming and Animations', pages: 50, problems: 36 },
  { id: 16, title: 'JavaFX UI Controls and Multimedia', pages: 48, problems: 31 },
  { id: 17, title: 'Binary I/O', pages: 28, problems: 21 },
  { id: 18, title: 'Recursion', pages: 32, problems: 38 },
  { id: 19, title: 'Generics', pages: 24, problems: 11 },
  { id: 20, title: 'Lists, Stacks, Queues, and Priority Queues', pages: 40, problems: 23 },
  { id: 21, title: 'Sets and Maps', pages: 24, problems: 15 },
  { id: 22, title: 'Developing Efficient Algorithms', pages: 48, problems: 27 },
  { id: 23, title: 'Sorting', pages: 36, problems: 19 },
  {
    id: 24,
    title: 'Implementing Lists, Stacks, Queues, and Priority Queues',
    pages: 36,
    problems: 16,
  },
  { id: 25, title: 'Binary Search Trees', pages: 36, problems: 19 },
  { id: 26, title: 'AVL Trees', pages: 20, problems: 7 },
  { id: 27, title: 'Hashing', pages: 30, problems: 15 },
  { id: 28, title: 'Graphs and Applications', pages: 46, problems: 26 },
  { id: 29, title: 'Weighted Graphs and Applications', pages: 38, problems: 20 },
  { id: 30, title: 'Aggregate Operations for Collection Streams', pages: 31, problems: 19 },
]

export const TOTAL_PAGES = CHAPTERS_DATA.reduce((sum, chapter) => sum + chapter.pages, 0)
export const TOTAL_PROBLEMS = CHAPTERS_DATA.reduce((sum, chapter) => sum + chapter.problems, 0)
export const TOTAL_CHAPTERS = CHAPTERS_DATA.length

export const DEFAULT_SETTINGS = {
  AVERAGE_READING_SPEED: 7.5, // minutes per page
  AVERAGE_PROBLEM_TIME: 20, // minutes per problem
  MCQ_QUIZ_TIME: 30, // minutes per chapter MCQ quiz
  DEFAULT_DAILY_HOURS: 4,
}
