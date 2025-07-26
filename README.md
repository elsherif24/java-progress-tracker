# Java Programming Study Tracker

A modern Vue 3 application for tracking your progress through "Introduction to Java Programming and Data Structures, 12th Edition". This project has been converted from a legacy static HTML/CSS/JavaScript application into a modular, component-based Vue 3 application.

## Features

- 📚 **Chapter Progress Tracking**: Track reading progress, problems solved, and MCQ completion for all 30 chapters
- 📊 **Progress Visualization**: Real-time progress bars and statistics
- 🔥 **Study Streak**: Monitor your daily study consistency
- ⏱️ **Time Estimates**: Customizable study time calculations based on your reading speed and problem-solving pace
- 🔊 **Audio Feedback**: Celebration sounds for achievements (toggleable)
- 📥📤 **Data Management**: Export and import your progress data
- 🌙 **Dark Theme**: Beautiful dark mode interface with twinkling star effects
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Vite** for fast development and building
- **CSS Custom Properties** for theming
- **Web Audio API** for sound effects

## Project Structure

```
src/
├── components/
│   ├── AppHeader.vue          # Application header
│   ├── AppControls.vue        # Control buttons (sound, export, import, reset)
│   ├── ProgressSummary.vue    # Overall progress dashboard
│   ├── ChapterCard.vue        # Individual chapter progress card
│   ├── CelebrationModal.vue   # Success/achievement modal
│   └── ConfirmationModal.vue  # Confirmation dialog
├── stores/
│   └── counter.ts             # Main Pinia store for study tracker
├── services/
│   └── soundService.ts        # Audio management service
├── types/
│   └── index.ts               # TypeScript type definitions
├── data/
│   └── chapters.ts            # Chapter data and constants
├── assets/
│   ├── main.css              # Base styles
│   └── study-tracker.css     # Study tracker specific styles
└── App.vue                   # Main application component
```

## Features Overview

### Component Architecture

The application follows Vue 3 best practices with:
- **Single File Components** (SFC) with `<script setup>` syntax
- **Composition API** for reactive state management
- **TypeScript** for better development experience
- **Scoped styles** to prevent CSS conflicts

### State Management

- **Pinia store** manages all application state
- **Local storage** persistence for progress data
- **Reactive getters** for computed properties like overall progress and time estimates

### Audio System

- **Web Audio API** for tone generation
- **HTML5 Audio** for achievement sound files
- **Progressive enhancement** - gracefully degrades if audio is not supported

### Data Management

- **JSON export/import** for backing up progress
- **Validation** of imported data
- **Migration support** for different data versions

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Usage

1. **Track Reading Progress**: Update pages read for each chapter
2. **Log Problem Solutions**: Record how many programming problems you've solved
3. **Mark MCQ Completion**: Check off when you've completed chapter quizzes
4. **Mark Chapters Complete**: Use the completion buttons or let the app auto-complete when all tasks are done
5. **Customize Study Settings**: Adjust reading speed and problem-solving time for accurate estimates
6. **Export Progress**: Back up your data as JSON files
7. **Import Progress**: Restore data from exported files

## Migration from Legacy Version

This Vue 3 version maintains full compatibility with the legacy version's data format. You can:

1. Export data from the old version
2. Import it into this Vue 3 version
3. Continue tracking your progress seamlessly

## Audio Files

The application includes celebration sound effects:
- `small win.mp3` - Individual chapter completion
- `medium win.mp3` - Every 5th chapter milestone
- `big win.mp3` - Every 10th chapter milestone  
- `Big win 2.mp3` - All chapters completed

## Browser Support

- Modern browsers with ES6+ support
- Web Audio API support for sound effects
- Local Storage support for data persistence

## License

This project is for educational purposes related to tracking progress through Java programming studies.
