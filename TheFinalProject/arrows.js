// Define directions with actual arrow symbols
const DIRECTIONS = [
    { label: "↑", validKeys: ["ArrowUp", "KeyW"] },
    { label: "↓", validKeys: ["ArrowDown", "KeyS"] },
    { label: "←", validKeys: ["ArrowLeft", "KeyA"] },
    { label: "→", validKeys: ["ArrowRight", "KeyD"] }
  ];
  
  const scoreEl = document.getElementById("score");
  const timeLeftEl = document.getElementById("timeLeft");
  const sequenceEl = document.getElementById("directionSequence");
  const startBtn = document.getElementById("startBtn");
  const endMessageEl = document.getElementById("endMessage");
  
  let round = 0;
  let score = 0;
  let timer = 0;
  let timerInterval = null;
  let sequence = [];
  let currentIndex = 0;
  let gameActive = false;
  
  const baseTime = 10;         // Starting time for round 1 (seconds)
  const timeDecay = 0.5;       // Time reduction per round
  const minSequenceLength = 5;
  const maxSequenceLength = 10;
  
  function startGame() {
    resetGame();
    nextRound();
  }
  
  function resetGame() {
    clearInterval(timerInterval);
    round = 0;
    score = 0;
    gameActive = true;
    currentIndex = 0;
    scoreEl.textContent = score;
    timeLeftEl.textContent = "--";
    sequenceEl.innerHTML = "";
  }
  
  function nextRound() {
    round++;
    // Generate a random sequence of directions
    const length = Math.floor(Math.random() * (maxSequenceLength - minSequenceLength + 1)) + minSequenceLength;
    sequence = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * DIRECTIONS.length);
      sequence.push(DIRECTIONS[randomIndex]);
    }
    renderSequence();
    currentIndex = 0;
    // Calculate time for this round
    timer = Math.max(1, baseTime - timeDecay * (round - 1));
    timeLeftEl.textContent = timer;
    
    timerInterval = setInterval(() => {
      timer--;
      timeLeftEl.textContent = timer;
      if (timer <= 0) {
        endGame();
      }
    }, 1000);
  }
  
  function renderSequence() {
    sequenceEl.innerHTML = sequence
      .map((dir, idx) => {
        // Highlight the first direction by default
        return `<span class="direction ${idx === 0 ? 'active' : ''}">${dir.label}</span>`;
      })
      .join(" ");
  }
  
  function updateSequenceDisplay() {
    const directionSpans = document.querySelectorAll(".direction");
    directionSpans.forEach((span, idx) => {
      span.classList.remove("active");
      if (idx === currentIndex) {
        span.classList.add("active");
      }
    });
  }
  
  document.addEventListener("keydown", (e) => {
    if (!gameActive || sequence.length === 0) return;
    const nextDir = sequence[currentIndex];
    
    // Check if the pressed key is one of the valid keys for the next direction
    if (nextDir.validKeys.includes(e.code)) {
      currentIndex++;
      const directionSpans = document.querySelectorAll(".direction");
      if (currentIndex - 1 < directionSpans.length) {
        directionSpans[currentIndex - 1].classList.add("correct");
      }
      updateSequenceDisplay();
      // If the entire sequence is correctly completed:
      if (currentIndex >= sequence.length) {
        score++;
        scoreEl.textContent = score;
        clearInterval(timerInterval);
        nextRound();
      }
    } else {
      // Wrong key pressed, end the game
      endGame();
    }
  });
  
  function endGame() {
    if (!gameActive) return;
    gameActive = false;
    clearInterval(timerInterval);
    sequenceEl.innerHTML = "";
    // Redirect to gameover page with final score as a query parameter
    window.location.href = "gameover.html?score=" + score;
  }
  