const notepad = document.getElementById('notepad');
const wordCountDisplay = document.getElementById('word-count');
const darkModeBtn = document.getElementById('dark-mode-btn');
const exportBtn = document.getElementById('export-btn');

// Function to count words
function updateWordCount() {
  const text = notepad.value.trim();
  const words = text === '' ? 0 : text.split(/\s+/).length;
  wordCountDisplay.textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

// Load saved content and dark mode preference
chrome.storage.local.get(['notepadContent', 'darkMode'], (result) => {
  if (result.notepadContent) {
    notepad.value = result.notepadContent;
    updateWordCount();
  }
  
  if (result.darkMode) {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️';
  }
  
  notepad.focus();
});

// Save content as user types (debounced to avoid too many writes)
let saveTimeout;
notepad.addEventListener('input', () => {
  updateWordCount();
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.local.set({ notepadContent: notepad.value });
  }, 100);
});

// Dark mode toggle
darkModeBtn.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
  chrome.storage.local.set({ darkMode: isDarkMode });
});

// Export as TXT file
exportBtn.addEventListener('click', () => {
  const text = notepad.value;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  // Create filename with timestamp
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
  a.href = url;
  a.download = `notepad-${timestamp}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
});
