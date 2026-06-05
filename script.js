const signalDisplay =
document.getElementById("signalDisplay");

 let currentPuzzle;
let foundWords = [];
let selectedTiles = [];
let isDragging = false;
let typingInterval = null;

let bootSkipped = false;

let totalScore =
  Number(sessionStorage.getItem("signalScore")) || 0;

document.getElementById("scoreDisplay").textContent =
  totalScore;


function skipBoot() {

  if (bootSkipped) return;

  bootSkipped = true;

  const bootText =
    document.getElementById("bootText");

  const beginButton =
    document.getElementById("beginButton");

  bootText.innerHTML =
    bootLines.join("<br>");

  beginButton.style.display = "block";
}

function startGame() {
  const screen =
    document.getElementById("startScreen");

  screen.style.opacity = "0";

  setTimeout(() => {
    screen.style.display = "none";
    loadWordSignal();
  }, 500);
}

const wordFoundSound = new Audio("word-found.mp3");

const bootLines = [
  "BOOTING SENTIENT PROCESSOR...",
  "",
  "SIGNAL DETECTED.",
  "",
  "The system has started talking.",
  "Nobody knows why.",
  "",
  "Locate hidden signal words.",
  "Decode each transmission.",
  "",
  "The processor appears to be",
  "developing opinions.",
  "",
  "This is concerning."
];

let bootLineIndex = 0;
let bootCharIndex = 0;




function typeBootText() {

  if (bootSkipped) return;
  const bootText =
    document.getElementById("bootText");

  const beginButton =
    document.getElementById("beginButton");

  if (bootLineIndex >= bootLines.length) {
    beginButton.style.display = "block";
    return;
  }

  const currentLine =
    bootLines[bootLineIndex];

  if (bootCharIndex < currentLine.length) {

    bootText.innerHTML +=
      currentLine.charAt(bootCharIndex);

    bootCharIndex++;

    setTimeout(typeBootText, 35);

  } else {

    bootText.innerHTML += "<br>";

    bootLineIndex++;

    bootCharIndex = 0;

    setTimeout(typeBootText, 350);
  }
}




let soundUnlocked = false;
let usedPuzzleIndexes = [];

const rewardMilestones = [
 
  30000
  
];


function unlockSound() {
  const sound = document.getElementById("signalSound");

  if (!sound || soundUnlocked) return;

  sound.play()
    .then(() => {
      sound.pause();
      sound.currentTime = 0;
      soundUnlocked = true;
    })
    .catch(() => {
      console.log("Sound waiting for user tap");
    });
}

document.addEventListener("pointerdown", unlockSound, { once: true });

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5); 
  
}

const signalPuzzles = [


{
  phrase: "DO YOU NOTICE THE TOASTER ACTING DIFFERENT WHEN WE HAVE COMPANY OVER?",

  HINT: "Breakfast appliance behavior suspicious.",

  words: ["TOASTER", "NOTICE", "ACTING", "DIFFERENT", "COMPANY", "HAVE"],

  paths: {
    TOASTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],

    DIFFERENT: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],

    COMPANY: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    NOTICE: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]],

    ACTING: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],

    HAVE: [[3,4],[4,4],[5,4],[6,4]]
  }
},





















];

function loadWordSignal() {
  if (usedPuzzleIndexes.length === signalPuzzles.length) {
    usedPuzzleIndexes = [];
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * signalPuzzles.length);
  } while (usedPuzzleIndexes.includes(randomIndex));

  usedPuzzleIndexes.push(randomIndex);

  currentPuzzle = signalPuzzles[randomIndex];

  currentPuzzle.words =
    shuffleArray([...currentPuzzle.words]);

  foundWords = [];
  selectedTiles = [];

  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

signalDisplay.textContent =
  "HINT: " + currentPuzzle.HINT;

  document.getElementById("wordCount").textContent =
    currentPuzzle.words.length;

  

  createWordGrid(currentPuzzle);
}


function createWordGrid(puzzle) {
  const grid = document.getElementById("wordGrid");
  grid.innerHTML = "";

  const rows = 11;
  const cols = 8;

const letters = Array.from(
  { length: rows },
  () => Array(cols).fill("")
);

 

  puzzle.words.forEach(word => {
    placeWordOnPath(word, puzzle.paths[word], letters);
  });

  for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
      if (letters[r][c] === "") {
        letters[r][c] = randomLetter();
      }

      const tile = document.createElement("div");

      tile.className = "letterTile";
      tile.textContent = letters[r][c];

      tile.dataset.row = r;
      tile.dataset.col = c;

      tile.addEventListener("pointerdown", startSelect);
        tile.addEventListener("pointermove", dragSelect);
      
      grid.appendChild(tile);
    }
  }
}

function placeWordOnPath(word, path, letters) {
  for (let i = 0; i < word.length; i++) {
    const row = path[i][0];
    const col = path[i][1];

    letters[row][col] = word[i];
  }
}



function startSelect(e) {
  const tile = e.target.closest(".letterTile");

  if (!tile || tile.classList.contains("found")) return;

  e.preventDefault();

  isDragging = true;
  clearSelection();
  selectedTiles = [];

  selectTile(tile);
}

function dragSelect(e) {
  if (!isDragging) return;

  e.preventDefault();

  const element = document.elementFromPoint(e.clientX, e.clientY);
  const tile = element?.closest(".letterTile");

  if (!tile || tile.classList.contains("found")) return;

  selectTile(tile);
}

function endSelect() {
  if (!isDragging) return;

  isDragging = false;

  const word = selectedTiles.map(tile => tile.textContent).join("");
  const reversedWord = word.split("").reverse().join("");

  let matchedWord = null;

  currentPuzzle.words.forEach(realWord => {
    if (word === realWord || reversedWord === realWord) {
      matchedWord = realWord;
    }
  });

  if (matchedWord && !foundWords.includes(matchedWord)) {
    foundWords.push(matchedWord);
    
      if (soundEnabled) {
  wordFoundSound.currentTime = 0;
  wordFoundSound.play().catch(() => {});
}

    document.getElementById("wordCount").textContent =
      currentPuzzle.words.length - foundWords.length;

    selectedTiles.forEach(tile => {
      tile.classList.remove("selected");
      tile.classList.add("found");
    });

    checkPuzzleComplete();
}else {
    clearSelection();
  }

  selectedTiles = [];
}

function selectTile(tile) {
  if (!tile.classList.contains("letterTile")) return;
  if (selectedTiles.includes(tile)) return;
  if (tile.classList.contains("found")) return;

  selectedTiles.push(tile);
  tile.classList.add("selected");
}

function clearSelection() {
  document
    .querySelectorAll(".letterTile.selected")
    .forEach(tile => {
      tile.classList.remove("selected");
    });
}


function playWordFoundSound() {
  const sound = document.getElementById("wordFoundSound");

  if (!sound) return;

  sound.currentTime = 0;
  sound.volume = 1;

  sound.play().catch(error => {
    console.log("Word sound blocked or missing:", error);
  });
}


function playSignalSound() {
  if (!soundEnabled) return;

  const sound = document.getElementById("signalSound");

  if (!sound) return;

  sound.currentTime = 0;
  sound.volume = 1;

  sound.play().catch(error => {
    console.log("Sound blocked or missing:", error);
  });
}



function checkPuzzleComplete() {
  if (foundWords.length === currentPuzzle.words.length) {

    const screen = document.getElementById("wordSignalScreen");

    if (screen) {
      screen.classList.add("glitching");

      setTimeout(() => {
        screen.classList.remove("glitching");
      }, 900);
    }

    const pointsEarned = currentPuzzle.words.length * 100;

    totalScore += pointsEarned;
    sessionStorage.setItem(
  "signalScore",
  totalScore
);

    document.getElementById("scoreDisplay").textContent = totalScore;

    const flash = document.getElementById("pointsFlash");

    flash.textContent = "+" + pointsEarned;
    flash.style.opacity = "1";

    setTimeout(() => {
      flash.style.opacity = "0";
    }, 1500);

    playSignalSound();

    typeSystemResponse(currentPuzzle.phrase);

    setTimeout(() => {

      const reachedMilestone = rewardMilestones.some(
        milestone =>
          totalScore >= milestone &&
          totalScore - pointsEarned < milestone
      );

      if (reachedMilestone) {

       signalDisplay.innerHTML =
  `<div class="pointText">
    +${pointsEarned} POINTS<br>
    DUCK PARADE AUTHORIZED
  </div>
   <pre class="duckWiggle">
   &lt;(o )__  &lt;(o )__  &lt;(o )__<br>
        ( ._/    ( ._/    ( ._/ 

        </pre>`;  
          
  setTimeout(() => {
    loadWordSignal();
  }, 4000);

}
      

    }, 4000);
  }
}


function typeSystemResponse(text) {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  signalDisplay.textContent = "SYSTEM RESPONSE: ";

  let i = 0;

  typingInterval = setInterval(() => {
    signalDisplay.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }, 45);
}





function randomLetter() {
  const fillerChars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*$&#?@%";

  return fillerChars[
    Math.floor(Math.random() * fillerChars.length)
  ];
}


let soundEnabled =
  localStorage.getItem("soundEnabled") !== "false";

const soundBtn =
  document.getElementById("soundBtn");

soundBtn.textContent =
  soundEnabled ? "ON" : "OFF";

soundBtn.classList.toggle("off", !soundEnabled);

soundBtn.addEventListener("click", () => {

  soundEnabled = !soundEnabled;

  soundBtn.textContent =
    soundEnabled ? "ON" : "OFF";

  soundBtn.classList.toggle("off", !soundEnabled);

  localStorage.setItem(
    "soundEnabled",
    soundEnabled
  );
});



function showInstructions() {
  document.getElementById("instructionScreen").style.display = "flex";
}

function closeInstructions() {
  document.getElementById("instructionScreen").style.display = "none";
}


document.addEventListener("pointerdown", startSelect);
document.addEventListener("pointermove", dragSelect);
document.addEventListener("pointerup", endSelect);
document.addEventListener("pointercancel", endSelect);

//start game

typeBootText();

