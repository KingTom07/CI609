const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

let words = [];
let currentWordIndex = 0;
let correctWords = 0;
let totalWordsTyped = 0;
let timer = 30;
let interval;
let gameStarted = false;
let elapsed = 0;

const dataPoints = { time: [], wpm: [], accuracy: [] };

function startBurst() {
  resetGame();
  generateWords();
  inputEl.disabled = false;
  inputEl.focus();
  gameStarted = true;

  interval = setInterval(() => {
    elapsed++;
    timer--;
    timeEl.textContent = timer;

    if (elapsed % 5 === 0 || timer <= 0) {
      updateStats(true);
    }

    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function resetGame() {
  clearInterval(interval);
  currentWordIndex = 0;
  correctWords = 0;
  totalWordsTyped = 0;
  timer = 30;
  elapsed = 0;
  gameStarted = false;
  inputEl.value = "";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  timeEl.textContent = "30";
  textEl.innerHTML = "";
  dataPoints.time = [];
  dataPoints.wpm = [];
  dataPoints.accuracy = [];
}

function generateWords() {
  words = [];
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    words.push(randomWords[randomIndex]);
  }

  textEl.innerHTML = words
    .map((word, index) => `<span id="word-${index}">${word}</span>`)
    .join(" ");
  highlightWord(0);
}

function highlightWord(index) {
  const allWords = document.querySelectorAll("#text span");
  allWords.forEach((el) => el.classList.remove("active-word"));
  const current = document.getElementById(`word-${index}`);
  if (current) current.classList.add("active-word");
}

inputEl.addEventListener("keydown", (e) => {
  if (!gameStarted || e.key !== " ") return;

  const typedWord = inputEl.value.trim();
  const currentWord = words[currentWordIndex];
  const wordEl = document.getElementById(`word-${currentWordIndex}`);

  if (typedWord === currentWord) {
    wordEl.classList.add("correct");
    correctWords++;
  } else {
    wordEl.classList.add("incorrect");
  }

  totalWordsTyped++;
  currentWordIndex++;
  inputEl.value = "";
  highlightWord(currentWordIndex);
  updateStats();
});

function updateStats(log = false) {
  const wpm = Math.round((correctWords / elapsed) * 60) || 0;
  const accuracy = Math.round((correctWords / totalWordsTyped) * 100) || 100;
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + "%";

  if (log) {
    dataPoints.time.push(elapsed);
    dataPoints.wpm.push(wpm);
    dataPoints.accuracy.push(accuracy);
  }
}

function endGame() {
  clearInterval(interval);
  inputEl.disabled = true;
  inputEl.value = "";
  gameStarted = false;

  const resultData = {
    wpm: parseInt(wpmEl.textContent),
    accuracy: parseInt(accuracyEl.textContent),
    labels: dataPoints.time,
    wpmData: dataPoints.wpm,
    accuracyData: dataPoints.accuracy
  };

  localStorage.setItem("burstResults", JSON.stringify(resultData));
  window.location.href = "burst-results.html";
}
