const commands = [
    { label: "Ctrl + C", keys: ["Control", "c"] },
    { label: "Ctrl + V", keys: ["Control", "v"] },
    { label: "Ctrl + Z", keys: ["Control", "z"] },
    { label: "Alt + Tab", keys: ["Alt", "Tab"] },
    { label: "Ctrl + Shift + Esc", keys: ["Control", "Shift", "Escape"] },
    { label: "Ctrl + A", keys: ["Control", "a"] },
    { label: "Win + D", keys: ["Meta", "d"] } // Meta is Win key
  ];
  
  let currentCommand = null;
  let pressedKeys = new Set();
  
  function startCommandGame() {
    document.getElementById("result").textContent = "";
    pressedKeys.clear();
    currentCommand = commands[Math.floor(Math.random() * commands.length)];
    document.getElementById("currentCommand").textContent = currentCommand.label;
  }
  
  document.addEventListener("keydown", (e) => {
    pressedKeys.add(e.key);
  
    if (currentCommand && isMatch(currentCommand.keys, Array.from(pressedKeys))) {
      document.getElementById("result").textContent = "✅ Correct!";
      setTimeout(startCommandGame, 1500);
    }
  });
  
  document.addEventListener("keyup", (e) => {
    pressedKeys.delete(e.key);
  });
  
  function isMatch(expectedKeys, actualKeys) {
    return expectedKeys.every(key => actualKeys.includes(key)) &&
           actualKeys.length === expectedKeys.length;
  }
  