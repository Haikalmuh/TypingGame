const sentences = [
  "Typing games are super fun!",
  "Test your typing speed here.",
  "Frontend projects boost skills.",
  "Let's build something awesome!",
  "Keep practicing and never quit.",
  "Fast fingers win the race!",
  "Can you beat your high score?",
  "Every keystroke counts now.",
  "Focus, type, and don't give up!",
  "Code like a ninja!",
  "Practice makes perfect, every day.",
  "Failure is just a step to success.",
  "Debugging is like being a detective.",
  "Creativity fuels great developers.",
  "Stay curious, keep learning!",
  "Typing fast is a useful superpower.",
  "Write code, break stuff, repeat.",
  "You got this, don't stop now!",
  "Patience is part of progress.",
  "Hustle in silence, type in speed."
];

let sentence = "";
let correctChars = 0;
let totalTypedChars = 0;
let timeLeft = 60;
let timerStarted = false;
let timerInterval;
let highScore = localStorage.getItem("highWPM") || 0;

const displayText = document.getElementById("sentence-display");
const inputBox = document.getElementById("input-box");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const highScoreDisplay = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");

highScoreDisplay.textContent = highScore;

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}

function showSentence() {
  sentence = getRandomSentence();
  displayText.innerHTML = sentence
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("");

  // Tambah efek animasi saat tampil
  displayText.classList.remove("fade-in");
  void displayText.offsetWidth; // Trigger reflow untuk animasi bisa diulang
  displayText.classList.add("fade-in");
}

function updateStats() {
  const timeSpent = 60 - timeLeft;
  const wordsTyped = totalTypedChars / 5;
  const wpm = timeSpent > 0 ? Math.round((wordsTyped / timeSpent) * 60) : 0;
  const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 100;

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;

  if (wpm > highScore) {
    localStorage.setItem("highWPM", wpm);
    highScoreDisplay.textContent = wpm;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      inputBox.disabled = true;
      inputBox.placeholder = "Waktu habis! Klik ulangi untuk main lagi.";
    }
  }, 1000);
}

inputBox.addEventListener("input", () => {
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }

  const userInput = inputBox.value;
  totalTypedChars++;

  // Format tampilan karakter
  const charSpans = displayText.querySelectorAll("span");
  correctChars = 0;

  for (let i = 0; i < sentence.length; i++) {
    const char = userInput[i];

    if (char == null) {
      charSpans[i].classList.remove("correct", "incorrect");
    } else if (char === sentence[i]) {
      charSpans[i].classList.add("correct");
      charSpans[i].classList.remove("incorrect");
      correctChars++;
    } else {
      charSpans[i].classList.add("incorrect");
      charSpans[i].classList.remove("correct");
    }
  }

  updateStats();

  // Jika panjang input sama dengan kalimat, ganti kalimat
  if (userInput.length === sentence.length) {
    showSentence();
    inputBox.value = "";
  }
});

restartBtn.addEventListener("click", () => {
  timeLeft = 60;
  timerStarted = false;
  correctChars = 0;
  totalTypedChars = 0;
  timerDisplay.textContent = timeLeft;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  inputBox.value = "";
  inputBox.disabled = false;
  inputBox.placeholder = "Mulai mengetik di sini...";
  showSentence();
  clearInterval(timerInterval);
});

showSentence();
