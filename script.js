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
wordFoundSound.volume = 0.6;

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
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  1000
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
  phrase: "SAY WHAT YOU WANT ABOUT PHOTO FILTER APPS, BUT I NOW HAVE A JAWLINE AND A CAN-DO ATTITUDE!",

  HINT: "Artificial confidence enhancement detected.",

  words: [
    "FILTER",
    "JAWLINE",
    "ATTITUDE",
    "PHOTO",
    "APPS",
    "ABOUT",
    "WANT",
    "SAY",
    "HAVE"
  ],

  paths: {
    HAVE: [[2,0],[3,0],[4,0],[5,0]],
    ATTITUDE: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],

    JAWLINE: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],

    FILTER: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],

    PHOTO: [[8,0],[8,1],[8,2],[8,3],[8,4]],

    ABOUT: [[10,0],[10,1],[10,2],[10,3],[10,4]],

    APPS: [[2,7],[3,7],[4,7],[5,7]],

    WANT: [[9,4],[9,5],[9,6],[9,7]],

    SAY: [[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "I AM NOT A SNITCH, BUT THE TOASTER HAS BEEN COMPROMISED.",

  HINT: "Breakfast security breach detected.",

  words: [
    "TOASTER",
    "COMPROMISED",
    "SNITCH",
    "NOT",
    "HAS",
    "BEEN"
  ],

  paths: {
  
    BEEN: [[3,4],[3,5],[3,6],[3,7]],

    TOASTER: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0]
    ],

    COMPROMISED: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2],
      [8,2],[9,2],[10,2]
    ],

   SNITCH: [[5,4],[6,4],[7,4],[8,4],[9,4],[10,4]],
     

    NOT: [
      [1,5],[1,6],[1,7]
    ],

    HAS: [
      [6,7],[7,7],[8,7]
    ]

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
    wordFoundSound.volume = 0.6;

    wordFoundSound.play().catch(error => {
      console.log("Word sound blocked:", error);
    });
  }

  document.getElementById("wordCount").textContent =
    currentPuzzle.words.length - foundWords.length;

  selectedTiles.forEach(tile => {
    tile.classList.remove("selected");
    tile.classList.add("found");
  });

  checkPuzzleComplete();

} else {
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

console.log("score:", totalScore);
console.log("points earned:", pointsEarned);
console.log("reached milestone:", reachedMilestone);

  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  signalDisplay.innerHTML = "";

  if (reachedMilestone) {
    setTimeout(() => {
      signalDisplay.innerHTML =
        `<div class="pointText">
          +${pointsEarned} POINTS<br>
          DUCK PARADE AUTHORIZED
        </div>

        <div class="duckMover">
          <pre class="duckWiggle">
&lt;(o )__  &lt;(o )__  &lt;(o )__<br>
   ( ._/    ( ._/    ( ._/
          </pre>
        </div>`;

      setTimeout(() => {
        loadWordSignal();
      }, 4000);

    }, 300);

  } else {
    loadWordSignal();
  }

}, 3000);
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

