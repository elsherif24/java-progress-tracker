# Migration Guide: Legacy to Vue 3

This guide helps you migrate from the legacy HTML/CSS/JavaScript version to the new Vue 3 application.

## Before You Start

1. **Backup your data**: Export your progress from the legacy version before switching
2. **Keep both versions**: You can run both versions side by side during transition

## Migration Steps

### Step 1: Export from Legacy Version

1. Open your legacy version (old/index.html)
2. Click "📊 Export Progress"
3. Save the downloaded JSON file

### Step 2: Import to Vue 3 Version

1. Start the Vue 3 application (`npm run dev`)
2. Open <http://localhost:5173>
3. Click "📥 Import Progress"
4. Select your exported JSON file
5. Confirm the import

### Step 3: Verify Data

- Check that your chapter progress matches
- Verify your study streak is correct
- Confirm problem counts and page progress

## What's New in Vue 3 Version

### Enhanced Features

- **Better Performance**: Faster loading and smoother interactions
- **Improved Responsiveness**: Better mobile and tablet experience
- **Enhanced Accessibility**: Better keyboard navigation and screen reader support
- **Type Safety**: TypeScript provides better error catching during development

### Same Functionality

- All progress tracking features remain the same
- Same data format and structure
- Same calculation logic for time estimates
- Same achievement sounds and celebrations

### New Developer Benefits

- **Component-based**: Easier to maintain and extend
- **Modern Tools**: Vue 3, TypeScript, Vite, Pinia
- **Better Testing**: Component isolation makes testing easier
- **Scalable**: Easier to add new features

## Troubleshooting

### Import Issues

- **File not recognized**: Ensure the file is a valid JSON export from the legacy version
- **Missing data**: Check that all properties are present in the export file
- **Corrupt file**: Try exporting again from the legacy version

### Feature Differences

- **Sound files**: Make sure audio files are in the public/assets directory
- **Settings**: Study settings are preserved in localStorage
- **Streaks**: Streak calculations remain identical

## Rollback Plan

If you need to go back to the legacy version:

1. Export your data from Vue 3 version
2. Import it into the legacy version
3. All data should transfer seamlessly

## Support

If you encounter issues during migration:

1. Check browser console for error messages
2. Verify file paths for audio assets
3. Ensure localStorage permissions are enabled
4. Try refreshing the browser to reload state
