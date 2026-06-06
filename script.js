const signalDisplay =
document.getElementById("signalDisplay");

 let currentPuzzle;
let foundWords = [];
let selectedTiles = [];
let isDragging = false;
let typingInterval = null;


let bootSkipped = false;

let pendingDuckParade = false;
let pendingDuckCount = 1;
let pendingPointsEarned = 0;

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
  900,
  2500,
  5000,
  10000,
  20000,
  30000,
  40000,
  50000
];


const duckMessages = [
  "DUCK PARADE APPROVED.",
  "THE DUCKS HAVE BEEN NOTIFIED.",
  "WATERFOWL PROTOCOL ACTIVATED.",
  "THE PARADE PERMIT WAS GRANTED.",
  "TOO MANY DUCKS. PROCEEDING ANYWAY.",
  "THE DUCKS DEMANDED RECOGNITION.",
  "A CELEBRATORY DUCK HAS BEEN RELEASED.",
  "THE DUCK DEPARTMENT IS PLEASED.",
  "MIGRATION PATTERN UPDATED.",
  "UNEXPECTED DUCK ACTIVITY DETECTED.",
  "THE WATERFOWL ARE IMPRESSED.",
  "THE DUCKS CLAIM THIS IS A BIG DEAL.",
  "PARADE SIZE EXCEEDS RECOMMENDED LIMITS.",
  "THE DUCKS ARE UNIONIZING.",
  "HONK LEVELS WITHIN ACCEPTABLE RANGE."
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
  phrase: "YOUR BROWSER HAS TOO MANY TABS OPEN",
  
  HINT: "Chaotic internet activity detected.",

  words: [
    "TABS",
    "BROWSER",
    "TOO",
    "YOUR",
    "MANY",
    "OPEN"
  ],

  paths: {
    TABS: [
      [1,4],[1,5],[1,6],[1,7]
    ],

    TOO: [
      [3,5],[3,6],[3,7]
    ],

    YOUR: [
      [5,2],[5,3],[5,4],[5,5]
    ],

    MANY: [
      [7,3],[7,4],[7,5],[7,6]
    ],

    BROWSER: [
      [10,1],[10,2],[10,3],
      [10,4],[10,5],[10,6],[10,7]
    ],
    OPEN: [[3,0],[4,0],[5,0],[6,0]]
  }
},


{
  phrase: "THE WIFI HAS QUESTIONS ABOUT THE FOOD PYRAMID.",

  HINT: "Unusual dietary meal planning detected.",

  words: [
    
    "WIFI",

    "THE",
    "HAS",
    "QUESTIONS",
    "ABOUT",
    "FOOD",
    "PYRAMID"
    
    
    
  ],

  paths: {

    WIFI: [
      [0,4],[0,5],[0,6],[0,7]
    ],

    HAS: [[3,5],[3,6],[3,7]],
    
    ABOUT:[[0,2],[1,2],[2,2],[3,2],[4,2]],
    
    FOOD: [[5,3],[6,3],[7,3],[8,3]],
    
    PYRAMID: [[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]],

    THE: [
      [5,5],[5,6],[5,7]
    ],

    QUESTIONS: [
      [0,0],
      [1,0],
      [2,0],
      [3,0],
      [4,0],
      [5,0],
      [6,0],
      [7,0],
      [8,0]
    ]
  }
},



{
  phrase: "THOSE DISHES WILL NOT WASH THEMSELVES.",

  HINT: "Kitchen negligence detected.",

  words: [
    "WASH",
    "DISHES",
    "WILL",
    "THOSE",
    "NOT",
    "THEMSELVES"
  ],

  paths: {

    WASH: [
      [1,4],[1,5],[1,6],[1,7]
    ],

    NOT: [
      [3,5],[3,6],[3,7]
    ],

    WILL: [
      [5,4],[5,5],[5,6],[5,7]
    ],

    THOSE: [
      [7,3],[7,4],[7,5],[7,6],[7,7]
    ],

    DISHES: [
      [10,2],[10,3],[10,4],[10,5],[10,6],[10,7]
    ],
    
    THEMSELVES: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]]
  }
},




];


function handleNewSignal() {

  if (pendingDuckParade) {
    showDuckParade();
    return;
  }

  loadWordSignal();
}


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




signalDisplay.innerHTML =
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
    }, 7500);

    playSignalSound();

  typeSystemResponse(currentPuzzle.phrase);



const reachedMilestone = rewardMilestones.some(
  milestone =>
    totalScore >= milestone &&
    totalScore - pointsEarned < milestone
);

console.log("score:", totalScore);
console.log("points earned:", pointsEarned);
console.log("reached milestone:", reachedMilestone);



let duckCount = 1;

if (totalScore >= 500) duckCount = 1;
if (totalScore >= 2500) duckCount = 2;
if (totalScore >= 5000) duckCount = 4;
if (totalScore >= 10000) duckCount = 6;
if (totalScore >= 20000) duckCount = 8;
if (totalScore >= 30000) duckCount = 10;
if (totalScore >= 40000) duckCount = 12;
if (totalScore >= 50000) duckCount = 14;
if (totalScore >= 60000) duckCount = 16;

pendingDuckParade = reachedMilestone;
pendingDuckCount = duckCount;
pendingPointsEarned = pointsEarned;
  
  }
}

function showDuckParade() {

  pendingDuckParade = false;

  const duckMessage =
    duckMessages[
      Math.floor(Math.random() * duckMessages.length)
    ];

  signalDisplay.innerHTML =
    `<div class="pointText">
      +${pendingPointsEarned} POINTS<br>
      ${duckMessage}
    </div>

    <div class="duckMover">
      <pre class="duckWiggle">
${"&lt;(o )__  ".repeat(pendingDuckCount)}<br>
${"   ( ._/  ".repeat(pendingDuckCount)}
      </pre>
    </div>`;

  setTimeout(() => {
    loadWordSignal();
  }, 8000);
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

