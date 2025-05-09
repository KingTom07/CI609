const customInput = document.getElementById("customInput");
const startButton = document.querySelector("button");
const typingArea = document.getElementById("typingArea");
const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

let startTime = null;
let typedChars = 0;
let correctChars = 0;
let targetText = "";

function startCustomTest() {
  targetText = customInput.value.trim();

  if (!targetText) {
    alert("Please enter or paste some text to begin.");
    return;
  }

  // Display and reset state
  displayText(targetText);
  typingArea.classList.remove("hidden");
  inputElement.disabled = false;
  inputElement.value = "";
  inputElement.focus();

  startTime = null;
  typedChars = 0;
  correctChars = 0;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
}

function displayText(text) {
  textElement.innerHTML = text
    .split("")
    .map((char, i) => `<span id="char-${i}">${char}</span>`)
    .join("");
}

inputElement.addEventListener("input", () => {
  if (!startTime) startTime = Date.now();

  const typed = inputElement.value;
  typedChars = typed.length;

  for (let i = 0; i < targetText.length; i++) {
    const charSpan = document.getElementById(`char-${i}`);
    const typedChar = typed[i];

    if (!typedChar) {
      charSpan.classList.remove("correct", "incorrect");
    } else if (typedChar === targetText[i]) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
    }
  }

  correctChars = [...typed].filter((c, i) => c === targetText[i]).length;
  updateStats();

  if (typed === targetText) {
    endTest();
  }
});

function updateStats() {
  const elapsed = (Date.now() - startTime) / 60000; // in minutes
  const wpm = Math.round((correctChars / 5) / elapsed);
  const accuracy = Math.round((correctChars / typedChars) * 100) || 0;

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy + "%";
}

function endTest() {
  inputElement.disabled = true;
  alert("🎉 You've completed your custom typing test!");
}
