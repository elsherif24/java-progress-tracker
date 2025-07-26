<template>
  <header class="header">
    <h1>📚 Java Programming Study Tracker</h1>
    <p>Introduction to Java Programming and Data Structures, 12th Edition</p>
  </header>
</template>

<style scoped>
.header {
  background: var(--header-gradient);
  color: white;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(93, 173, 226, 0.3);
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.1;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.header p {
  font-size: 1.2em;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .header {
    padding: 30px 20px;
  }

  .header h1 {
    font-size: 2em;
  }

  .header p {
    font-size: 1em;
  }
}
</style>
