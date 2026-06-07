const signalDisplay =
document.getElementById("signalDisplay");

 let currentPuzzle;
let foundWords = [];
let selectedTiles = [];
let isDragging = false;
let typingInterval = null;


let bootSkipped = false;
let duckParadeActive = false;
let duckTimer = null;
let pendingDuckParade = false;

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
  1500,
  3500,
  7000,
  10000,
  13000,
  16000,
  20000,
  25000,
  30000,
  35000,
  40000,
  45000,
  50000,
  55000,
  60000,
  65000
];


const duckMessages = [
  
  "THE DUCKS SMELL OPPORTUNITY AND CHIMICHANGAS.",

"THE DUCKS HAVE FORMED A COMMITTEE.",

"THE POND IS EXPERIENCING RAPID GROWTH.",

"THE DUCKS REQUEST BETTER PARKING.",

"WATERFOWL CONFIDENCE EXCEEDS SAFE LIMITS.",

"THE DUCKS HAVE BEGUN NETWORKING.",

"THE DUCKS ACQUIRED A VAGUE BUSINESS PLAN.",

"THE POND HAS BUILT AN ALL-YOU-CAN-EAT MEXICAN BUFFET.",

"MIGRATION PATTERN UPDATED.",

"THE DUCKS NOW ACCEPT SPEAKING ENGAGEMENTS.",

"THE WATERFOWL ARE EXPANDING OPERATIONS.",

"DUCKS DETECT A MARKET OPPORTUNITY.",

"THE POND HAS ENTERED ITS STARTUP ERA.",

"THE DUCKS HAVE QUESTIONS ABOUT TAXES.",

"THE DUCKS ARE OVER-LEVERAGED IN NACHOS.",

"WATERFOWL OPTIMISM REACHES CRITICALLY DANGEROUS LEVELS.",

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



{
  phrase: "I AM THINKING OF BUYING LEATHER PANTS.",

  HINT: "Fashion decision loading.",

  words: [
    "THINKING",
    "BUYING",
    "LEATHER",
    "PANTS"
  ],

  paths: {

    THINKING: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0]
    ],

    BUYING: [
      [0,3],[1,3],[2,3],
      [3,3],[4,3],[5,3]
    ],

    LEATHER: [
      [2,7],[3,7],[4,7],
      [5,7],[6,7],[7,7],[8,7]
    ],

    PANTS: [
      [10,1],[10,2],[10,3],
      [10,4],[10,5]
    ]
  }
},









{
  phrase: "I AM ALLERGIC TO CATS. THE CAT KNOWS THIS.",

  HINT: "Feline exposure warning.",

  words: [
    "ALLERGIC",
    "CATS",
    "THE",
    
    "KNOWS",
    "THIS"
  ],

  paths: {

    ALLERGIC: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0]
    ],

    CATS: [
      [0,2],[1,2],[2,2],[3,2]
    ],

    THE: [
      [5,2],[6,2],[7,2]
    ],


    KNOWS: [
      [0,7],[1,7],[2,7],[3,7],[4,7]
    ],

    THIS: [
      [10,4],[10,5],[10,6],[10,7]
    ]
  }
},






{
  phrase: "DO YOU THINK DUCKS LIKE QUESADILLAS?",
  HINT: "Duck dinner preferences unknown.",

  words: ["QUESADILLAS", "DUCKS", "THINK", "LIKE", "YOU"],

  paths: {
    QUESADILLAS: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]],
    DUCKS: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    THINK: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    LIKE: [[9,3],[9,4],[9,5],[9,6]],
    YOU: [[7,5],[7,6],[7,7]]
  }
},

{
  phrase: "I AM SEARCHING FOR THE PERFECT SALSA RECIPE TO MAKE ON QUESADILLA NIGHT.",
  HINT: "Picante salsa investigation underway.",

  words: ["SEARCHING", "QUESADILLA", "PERFECT", "RECIPE", "MAKE", "SALSA", "NIGHT"],

  paths: {
    SEARCHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    QUESADILLA: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    PERFECT: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    RECIPE: [[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]],
    SALSA: [[6,1],[7,1],[8,1],[9,1],[10,1]],
    MAKE: [[0,7],[1,7],[2,7],[3,7]],
    NIGHT: [[2,4],[3,4],[4,4],[5,4],[6,4]]
  }
},


{
  phrase: "THAT DUCK HAS NOT RESPONDED TO MY QUESADILLA DINNER INVITE.",
  HINT: "Duck RSVP still pending.",

  words: ["RESPONDED", "QUESADILLA", "DINNER", "INVITE", "DUCK", "THAT"],

  paths: {
    RESPONDED: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    QUESADILLA: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    DINNER: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    INVITE: [[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]],
    DUCK: [[10,4],[10,5],[10,6],[10,7]],
    THAT: [[2,7],[3,7],[4,7],[5,7]]
  },
},



{
  phrase: "ASK THE VACUUM IF SHE HAS PLANS TONIGHT.",
  HINT: "Appliance social calendar pending.",

  words: ["VACUUM", "PLANS", "ASK", "THE", "SHE", "TONIGHT"],

  paths: {
    VACUUM: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    PLANS: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    ASK: [[2,5],[2,6],[2,7]],
    THE: [[4,5],[4,6],[4,7]],
    SHE: [[6,5],[6,6],[6,7]],
    TONIGHT: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]
  }
},

{
  phrase: "I ADDED PROTEIN POWDER TO THE SHOPPING CART, I AM ABOUT TO GET YOKED.",
  HINT: "Gains protocol initiated.",

  words: ["SHOPPING", "YOKED", "CART", "GET", "ADDED", "PROTEIN", "POWDER"],

  paths: {
    PROTEIN: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    SHOPPING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    YOKED: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    CART: [[3,2],[4,2],[5,2],[6,2]],
    GET: [[0,0],[0,1],[0,2]],
    ADDED: [[9,1],[9,2],[9,3],[9,4],[9,5]],
    POWDER: [[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]
  }
},

{
  phrase: "I ORDERED MYSELF A LEATHER JACKET.",
  HINT: "Coolness upgrade pending.",

  words: ["LEATHER", "JACKET", "ORDERED", "MYSELF"],

  paths: {
    LEATHER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    JACKET: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3]],
    ORDERED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    MYSELF: [[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]
  }
},


















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

{
  phrase: "THE MICROWAVE IS NOT A PERSONAL CHEF.",

  HINT: "Snack expectations unrealistic.",

  words: [
    "CHEF",
    "PERSONAL",
    "MICROWAVE",
    "NOT",
    "THE",
   
  ],

  paths: {

    CHEF: [
      [1,4],[1,5],[1,6],[1,7]
    ],

    NOT: [
      [3,5],[3,6],[3,7]
    ],

    THE: [
      [5,5],[5,6],[5,7]
    ],

   

    PERSONAL: [
      [10,0],[10,1],[10,2],[10,3],
      [10,4],[10,5],[10,6],[10,7]
    ],

    MICROWAVE: [
      [0,1],
      [1,1],
      [2,1],
      [3,1],
      [4,1],
      [5,1],
      [6,1],
      [7,1],
      [8,1]
    ]
  }
},

{
  phrase: "HUMAN SOCIETY NEEDS MORE BEANS.",

  HINT: "Civilization nutrition report detected.",

  words: [
    "SOCIETY",
    "HUMAN",
    "NEEDS",
    "BEANS",
    "MORE"
  ],

  paths: {

    SOCIETY: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6]
    ],

    HUMAN: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    NEEDS: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    BEANS: [
      [6,0],[6,1],[6,2],[6,3],[6,4]
    ],

    MORE: [
      [6,7],[7,7],[8,7],[9,7]
    ]
  }
},





{
  phrase: "I AM CONSIDERING A MUSTACHE.",
  HINT: "Facial hair protocol pending.",

  words: ["MUSTACHE", "CONSIDERING"],

  paths: {
    MUSTACHE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    CONSIDERING: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3]],
    
  }
},

{
  phrase: "DO YOU THINK I COULD PULL OFF A VEST?",
  HINT: "Fashion confidence uncertain.",

  words: ["THINK", "COULD", "PULL", "VEST", "YOU", "OFF"],

  paths: {
    THINK: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    COULD: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    PULL: [[0,6],[1,6],[2,6],[3,6]],
    VEST: [[9,0],[9,1],[9,2],[9,3]],
    YOU: [[7,4],[7,5],[7,6]],
    OFF: [[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "I HAVE DECIDED TO TAKE UP BIRD WATCHING",
  HINT: "Binocular personality forming.",

  words: ["DECIDED", "BIRD", "TAKE", "HAVE", "WATCHING"],

  paths: {
    DECIDED: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    BIRD: [[0,3],[1,3],[2,3],[3,3]],
    TAKE: [[0,6],[1,6],[2,6],[3,6]],
    HAVE: [[9,0],[9,1],[9,2],[9,3]],
    
    WATCHING: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "SHOULD I BUY A MOTORCYCLE?",
  HINT: "Midlife crisis loading.",

  words: ["MOTORCYCLE", "SHOULD", "BUY"],

  paths: {
    SHOULD: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    MOTORCYCLE: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    
    BUY: [[3,5],[3,6],[3,7]]
  }
},

{
  phrase: "THE MOON LOOKS BEAUTIFULLY RENDERED TONIGHT",
  HINT: "Suspiciously pleasant night sky graphics",

  words: [
    "RENDERED",
    "TONIGHT",
    "LOOKS",
    "MOON",
    
    "BEAUTIFULLY"
  ],

  paths: {

    RENDERED: [
      [2,6],[3,6],[4,6],[5,6],
      [6,6],[7,6],[8,6],[9,6]
    ],

    TONIGHT: [
      [4,2],[5,2],[6,2],[7,2],
      [8,2],[9,2],[10,2]
    ],

    LOOKS: [
      [0,0],[1,0],[2,0],[3,0],[4,0]
    ],

    MOON: [
      [6,1],[7,1],[8,1],[9,1]
    ],

  
    BEAUTIFULLY: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4]]
  }
},

{
  phrase: "YOUR CAT HAS ADMIN PRIVILEGES.",

  HINT: "Feline access level suspicious.",

  words: [
    "PRIVILEGES",
    "ADMIN",
    "YOUR",
    "CAT",
    "HAS"
  ],

  paths: {

    PRIVILEGES: [
      [0,5],[1,5],[2,5],[3,5],[4,5],
      [5,5],[6,5],[7,5],[8,5],[9,5]
    ],

    ADMIN: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    YOUR: [
      [4,0],[4,1],[4,2],[4,3]
    ],

    CAT: [
      [6,0],[6,1],[6,2]
    ],

    HAS: [
      [5,7],[6,7],[7,7]
    ]
  }
},


{
  phrase: "SHOULD I GET A LEATHER JACKET?",

  HINT: "Fashion crisis detected.",

  words: [
    "SHOULD",
    "LEATHER",
    "JACKET",
    "GET"
  ],

  paths: {

    SHOULD: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    LEATHER: [
      [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6]
    ],

    JACKET: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5]
    ],

    GET: [
      [6,3], [6,4], [6,5]]
  }
},


{
  phrase: "WHY CAN I NOT FEEL MY LEGS?",

  HINT: "Body system panic detected.",

  words: [
    "WHY",
    "CAN",
    "NOT",
    "FEEL",
    "LEGS"
  ],

  paths: {

    WHY: [
      [0,0],[0,1],[0,2]
    ],

    CAN: [
      [2,0],[2,1],[2,2]
    ],

    NOT: [
      [4,0],[4,1],[4,2]
    ],

    FEEL: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    LEGS: [
      [4,6],[5,6],[6,6],[7,6]
    ]
  }
},


{
  phrase: "I SIGNED US UP FOR AN URBAN, KPOP, FUSION DANCE CLASS",

  HINT: "Unexpected trending, Korean dance commitment detected.",

  words: [
    "SIGNED",
    "URBAN",
    "DANCE",
    "FUSION",
    "KPOP",
    "FOR",
    "CLASS"
  ],

  paths: {

    SIGNED: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    URBAN: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4]],

    DANCE: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],
    
    KPOP: [[6,1],[7,1],[8,1],[9,1]],
    
    FUSION: [[0,7], [1,7], [2,7], [3,7], [4,7], [5,7]],
    
    CLASS: [[6,3], [7,3], [8,3], [9,3], [10,3]],




    FOR: [
      [6,5],[7,5],[8,5]
    ]
  }
},

{
  phrase: "REHEAT THAT LEFTOVER GARLIC BREAD FOR ME.",

  HINT: "Snack resurrection requested.",

  words: [
    "REHEAT",
    "LEFTOVER",
    "GARLIC",
    "BREAD",
    "THAT",
    "FOR"
  ],

  paths: {

    REHEAT: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    LEFTOVER: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6],[2,7]
    ],

    GARLIC: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5]
    ],

    BREAD: [
      [6,0],[6,1],[6,2],[6,3],[6,4]
    ],

    THAT: [
      [4,7],[5,7],[6,7],[7,7]
    ],

    FOR: [
      [8,2],[9,2],[10,2]
    ]
  }
}, 



{
  phrase: "THAT APP IS PRETENDING TO BE FINE.",
  HINT: "App is lying politely.",

  words: ["THAT", "APP", "PRETENDING", "FINE"],

  paths: {
    THAT: [[0,0],[0,1],[0,2],[0,3]],
    APP: [[2,0],[2,1],[2,2]],
    
    PRETENDING: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6]],
   
    
    FINE: [[7,0],[7,1],[7,2],[7,3]]
  }
},





{
  phrase: "THE SYSTEM REQUESTS A HOT POCKET.",
  HINT: "Break-time munchies requested.",

  words: ["THE", "SYSTEM", "REQUESTS", "HOT", "POCKET"],

  paths: {
    THE: [[0,0],[0,1],[0,2]],
    SYSTEM: [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    REQUESTS: [[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
  
    HOT: [[2,7],[3,7],[4,7]],
    POCKET: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]
  }
},

{
  phrase: "SOMETHING INSIDE THE USB IS CRYING.",
  HINT: "Tiny digital sobbing detected.",
  words: ["SOMETHING", "INSIDE", "CRYING", "THE", "USB"],
  paths: {
    SOMETHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    INSIDE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    CRYING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    THE: [[9,0],[9,1],[9,2]],
    USB: [[9,4],[9,5],[9,6]]
    
  }
},

{
  phrase: "THE FIREWALL IS FEELING PARANOID.",
  HINT: "Security has trust issues.",
  words: ["FIREWALL", "FEELING", "PARANOID", "THE"],
  paths: {
    FIREWALL: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    FEELING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    PARANOID: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    THE: [[9,0],[9,1],[9,2]]
   
  }
},

{
  phrase: "SOMETHING HERE IS LEAKING ELECTRICITY!",
  HINT: "Unsafe sparkle detected.",
  words: ["SOMETHING", "ELECTRICITY", "LEAKING", "HERE"],
  paths: {
    SOMETHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    ELECTRICITY: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2]],
    LEAKING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    HERE: [[8,4],[8,5],[8,6],[8,7]]
    
  }
},

{
  phrase: "WHY DOES THE WIFI SOUND ANGRY?",
  HINT: "Router attitude detected.",
  words: ["SOUND", "ANGRY", "DOES", "WIFI", "WHY", "THE"],
  paths: {
    SOUND: [[5,6],[6,6],[7,6],[8,6],[9,6]],
    WIFI: [[0,2],[1,2],[2,2],[3,2]],
    ANGRY: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    DOES: [[6,0],[6,1],[6,2],[6,3]],
    WHY: [[8,0],[8,1],[8,2]],
    THE: [[10,0],[10,1],[10,2]]
  }
},


{
  phrase: "THE BLUETOOTH IS AFRAID OF THUNDER.",
  HINT: "Wireless fear detected.",
  words: ["BLUETOOTH", "THUNDER", "AFRAID", "THE"],
  paths: {
    BLUETOOTH: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    THUNDER: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    AFRAID: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    THE: [[9,0],[9,1],[9,2]]
    
    
  }
},

{
  phrase: "THE MAINFRAME IS ASKING WEIRD QUESTIONS AGAIN.",
  HINT: "Old computer got curious.",
  words: ["MAINFRAME", "QUESTIONS", "ASKING", "WEIRD", "THE", "AGAIN"],
  paths: {
    MAINFRAME: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    QUESTIONS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    ASKING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    WEIRD: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    THE: [[9,0],[9,1],[9,2]],
    AGAIN: [[6,6],[7,6],[8,6],[9,6],[10,6]]
    
  }
},



{
  phrase: "YOU LOOK LIKE YOU OWN FIFTY FLASHLIGHTS...",
  HINT: "Flashlight collector detected.",
  words: ["FLASHLIGHTS", "FIFTY", "LOOK", "OWN", "YOU", "LIKE"],
  paths: {
    FLASHLIGHTS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]],
    FIFTY: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    LOOK: [[0,5],[1,5],[2,5],[3,5]],
    OWN: [[0,7],[1,7],[2,7]],
    YOU: [[7,5],[7,6],[7,7]],
    LIKE: [[9,1], [9,2], [9,3], [9,4]]
  }
},



{
  phrase: "YOUR COMPUTER IS AFRAID TO UPDATE, AND FRANKLY, SO AM I",
  HINT: "Update anxiety detected.",
  words: ["COMPUTER", "AFRAID", "UPDATE", "YOUR", "FRANKLY"],
  paths: {
    COMPUTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    AFRAID: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    UPDATE: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    YOUR: [[7,4],[7,5],[7,6],[7,7]],
    FRANKLY:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]
    
  }
},



{
  phrase: "HOW ABOUT YOU CLOSE THOSE FORTY-SEVEN TABS?",
  HINT: "Browser stability questionable.",

  words: ["ABOUT", "CLOSE", "THOSE", "TABS", "YOU", "HOW", "FORTY", "SEVEN"],

  paths: {
    ABOUT: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    CLOSE: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    THOSE: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    TABS: [[0,6],[1,6],[2,6],[3,6]],
    YOU: [[7,5],[7,6],[7,7]],
    HOW: [[6,0], [6,1], [6,2]],
    FORTY: [[8,1],[8,2],[8,3],[8,4],[8,5]],
    SEVEN: [[10,2],[10,3],[10,4],[10,5],[10,6]]

  }
},

{
  phrase: "I BET YOU COLLECT MICRO-USB CABLES.",
  HINT: "Cable hoarding suspected.",
  words: ["COLLECT", "MICRO", "USB", "BET", "YOU", "CABLES"],
  paths: {
    COLLECT: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    MICRO: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    USB: [[0,4],[1,4],[2,4]],
    BET: [[0,6],[1,6],[2,6]],
    YOU: [[7,5],[7,6],[7,7]],
    CABLES: [[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]
  }
},

{
  phrase: "I AM BEGGING YOU TO USE A COASTER!",
  HINT: "Beverage containment recommended.",

  words: ["COASTER","BEGGING","USE","YOU"],

  paths: {
    COASTER: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    BEGGING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    USE: [[9,2],[9,3],[9,4]],
    YOU: [[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "DID YOU JUST SAY \"OOPS\" BEFORE YOU FELL?",
  HINT: "Falling event confirmed.",

  words: ["BEFORE","OOPS","FELL","JUST","YOU", "DID","SAY"],

  paths: {
    BEFORE: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    OOPS: [[0,3],[1,3],[2,3],[3,3]],
    FELL: [[5,3],[6,3],[7,3],[8,3]],
    JUST: [[10,0],[10,1],[10,2],[10,3]],
    YOU: [[3,5],[3,6],[3,7]],
    DID: [[8,6],[9,6],[10,6]],
    SAY: [[5,5], [5,6],[5,7]]
  }
},
{
  phrase: "PLEASE, TELL THE VACUUM I SAID HOWDY.",
  HINT: "Appliance diplomacy initiated.",

  words: ["VACUUM","HOWDY","TELL","SAID", "THE", "PLEASE"],

  paths: {
    VACUUM: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    HOWDY: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    TELL: [[0,4],[1,4],[2,4],[3,4]],
    SAID: [[0,6],[1,6],[2,6],[3,6]],
    THE: [[6,4], [6,5], [6,6]],
    PLEASE: [[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]
  }
},

{
  phrase: "I HAVE QUESTIONS ABOUT DUCKS.",
  HINT: "Waterfowl inquiry pending.",

  words: ["QUESTIONS","DUCKS","ABOUT","HAVE"],

  paths: {
    QUESTIONS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    DUCKS: [[6,3],[6,4],[6,5],[6,6],[6,7]],
    ABOUT: [[0,5],[1,5],[2,5],[3,5],[4,5]],
    HAVE: [[10,3],[10,4],[10,5],[10,6]]
  }
},



{
  phrase: "BACK TO THE SAME YOU TUBE CHANNEL AGAIN HUH?",
  HINT: "Phone has detected a rerun.",
  words: ["BACK", "THE", "SAME", "YOU", "TUBE", "CHANNEL", "AGAIN"],
  paths: {
    BACK: [[0,0],[0,1],[0,2],[0,3]],
    
    THE: [[2,0],[2,1],[2,2]],
    SAME: [[2,4],[2,5],[2,6],[2,7]],
    YOU: [[4,0],[4,1],[4,2]],
    TUBE: [[4,4],[4,5],[4,6],[4,7]],
    CHANNEL: [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]],
    AGAIN: [[8,0],[8,1],[8,2],[8,3],[8,4]],
    
  }
},

{
  phrase: "TELL THE VACUUM SHES THE BEE'S NEEDS, URR, KNEADS... NO, NEVER MIND",
  HINT: "Compliment module malfunctioned.",
  words: ["TELL", "VACUUM", "SHES", "BEES", "NEEDS", "KNEADS", "NEVER", "MIND"],
  paths: {
    TELL: [[0,0],[0,1],[0,2],[0,3]],
    
    VACUUM: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
    SHES: [[4,0],[4,1],[4,2],[4,3]],
    
    BEES: [[6,0],[6,1],[6,2],[6,3]],
    NEEDS: [[4,5],[5,5],[6,5],[7,5],[8,5]],
    
    KNEADS: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],
    
    NEVER:  [[1,7],[2,7],[3,7],[4,7],[5,7]],
    MIND: [[8,0],[8,1],[8,2],[8,3]]
  }
},
{
  phrase: "I CAN NOT SLEEP, EXPLAIN CRYPTO TO ME AGAIN.",
  HINT: "Bedtime story on digital currency.",
  words: ["EXPLAIN", "CRYPTO", "AGAIN", "CAN", "NOT", "SLEEP"],
  paths: {
    EXPLAIN: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    CRYPTO: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
    AGAIN: [[6,0],[6,1],[6,2],[6,3],[6,4]],
    CAN: [[1,6],[2,6],[3,6]],
    NOT: [[6,6],[7,6],[8,6]],
    SLEEP: [[2,7],[3,7],[4,7],[5,7],[6,7]]
  }
},

{
  phrase: "ANOTHER PHOTO OF YOUR CAT I SEE",
  HINT: "Camera roll judgment active.",
  words: ["ANOTHER", "PHOTO", "YOUR", "CAT", "SEE"],
  paths: {
    ANOTHER: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    PHOTO: [[2,0],[2,1],[2,2],[2,3],[2,4]],
    
    YOUR: [[4,3],[4,4],[4,5],[4,6]],
    CAT: [[6,0],[6,1],[6,2]],
    
    SEE: [[8,0],[8,1],[8,2]]
  }
},

{
  phrase: "YOU OPENED THE SAME APP THRICE",
  HINT: "App loop behavior confirmed.",
  words: ["YOU", "OPENED", "THE", "SAME", "APP", "THRICE"],
  paths: {
    YOU: [[0,0],[0,1],[0,2]],
    OPENED: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
    THE: [[4,0],[4,1],[4,2]],
    SAME: [[4,4],[4,5],[4,6],[4,7]],
    APP: [[6,0],[6,1],[6,2]],
    THRICE: [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]
  }
},

{
  phrase: "YOU HAVE 50 FLASHLIGHTS, STOP USING ME FOR LIGHT!",
  HINT: "Phone flashlight resentment detected.",
  words: ["YOU", "HAVE", "FIFTY", "FLASHLIGHTS", "STOP", "USING", "FOR", "LIGHT"],
  paths: {
    FLASHLIGHTS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]],
    YOU: [[0,2],[0,3],[0,4]],
    HAVE: [[1,2],[1,3],[1,4],[1,5]],
    FIFTY: [[2,2],[2,3],[2,4],[2,5],[2,6]],
    STOP: [[3,2],[3,3],[3,4],[3,5]],
    USING: [[4,2],[4,3],[4,4],[4,5],[4,6]],
    
    FOR: [[6,2],[6,3],[6,4]],
    LIGHT: [[7,2],[7,3],[7,4],[7,5],[7,6]]
  }
},

{
  phrase: "THAT TEXT DID NOT NEED THAT MANY EMOJIS.",
  HINT: "Emoji excess confirmed.",
  words: ["THAT", "TEXT", "DID", "NOT", "NEED", "MANY", "EMOJIS"],
  paths: {
    THAT: [[0,0],[0,1],[0,2],[0,3]],

    EMOJIS: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]],

    TEXT: [[2,0],[2,1],[2,2],[2,3]],
    DID: [[4,0],[4,1],[4,2]],
    NOT: [[2,5],[3,5],[4,5]],
    NEED: [[6,0],[6,1],[6,2],[6,3]],
    MANY: [[8,0],[8,1],[8,2],[8,3]]
  }
},

{
  phrase: "YOU ARE JUST OPENING APPS OUT OF LONELINESS NOW.",
  HINT: "App loneliness spiral detected.",
  words: ["YOU", "ARE", "JUST", "OPENING", "APPS", "OUT", "LONELINESS", "NOW"],
  paths: {
    YOU: [[0,0],[0,1],[0,2]],
    ARE: [[8,0],[9,0],[10,0]],
    JUST: [[2,0],[3,0],[4,0],[5,0]],
    OPENING: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    APPS: [[0,4],[1,4],[2,4],[3,4]],
    OUT: [[8,4],[9,4],[10,4]],
    
    LONELINESS: [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]],
    NOW: [[5,5],[6,5],[7,5]]
  }
},
{
  phrase: "WHY DO YOU THINK TWENTY PERCENT BATTERY IS GOOD ENOUGH?",
  HINT: "Battery judgment activated.",
  words: ["WHY", "YOU", "THINK", "TWENTY", "PERCENT", "BATTERY", "GOOD", "ENOUGH"],
  paths: {
    WHY: [[0,0],[0,1],[0,2]],
    YOU: [[4,0],[5,0],[6,0]],

    THINK: [[2,2],[3,2],[4,2],[5,2],[6,2]],
    TWENTY: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]],
    PERCENT: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    BATTERY: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    GOOD: [[8,0],[8,1],[8,2],[8,3]],
    ENOUGH: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]]
  }
},

{
  phrase: "THE TOASTER SAYS \"TRUST ME\" WAY TOO MUCH.",
  HINT: "Suspicious appliance confidence detected.",

  words: ["TOASTER", "TRUST", "MUCH", "WAY", "SAYS"],

  paths: {
    TOASTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    
    TRUST: [[2,2],[2,3],[2,4],[2,5],[2,6]],
    SAYS: [[4,3],[4,4],[4,5],[4,6]],
    MUCH: [[7,1],[7,2],[7,3],[7,4]],
    WAY: [[9,5],[9,6],[9,7]]
  }
},


{
  phrase: "I AM GOING TO APPLY THE 'JUST WING IT' STRATEGY TODAY.",

  HINT: "Planning confidence level questionable.",

  words: [
    "GOING",
    "APPLY",
    "STRATEGY",
    "TODAY",
    "JUST",
    "WING",
    "THE"
  ],

  paths: {
    STRATEGY: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],

    GOING: [[0,6],[1,6],[2,6],[3,6],[4,6]],

    APPLY: [[2,0],[3,0],[4,0],[5,0],[6,0]],

    TODAY: [[9,1],[9,2],[9,3],[9,4],[9,5]],

    JUST: [[10,0],[10,1],[10,2],[10,3]],

    WING: [[7,4],[7,5],[7,6],[7,7]],

    THE: [[5,5],[5,6],[5,7]]
  }
},

{
  phrase: "YOU DO KNOW ESCALATORS COLLECT AND SEND OUT DIAGNOSTIC DATA, RIGHT?",

  HINT: "Escalator privacy concern detected.",

  words: [
    "ESCALATORS",
    "DIAGNOSTIC",
    "COLLECT",
    "SEND",
    "DATA",
    "RIGHT",
    "KNOW",
    "YOU"
  ],

  paths: {
    ESCALATORS: [
      [0,2],[1,2],[2,2],[3,2],[4,2],
      [5,2],[6,2],[7,2],[8,2],[9,2]
    ],

    DIAGNOSTIC: [
      [1,7],[2,7],[3,7],[4,7],[5,7],
      [6,7],[7,7],[8,7],[9,7],[10,7]
    ],

    COLLECT: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6]],

    SEND: [[0,0],[1,0],[2,0],[3,0]],

    DATA: [[5,4],[6,4],[7,4],[8,4]],

    RIGHT: [[2,6],[3,6],[4,6],[5,6],[6,6]],

    KNOW: [[0,4],[1,4],[2,4],[3,4]],

    YOU: [[9,4],[9,5],[9,6]]
  }
},

{
  phrase: "I AM JUST SAYING I WOULD FEEL BETTER IF I COULD GET A STATUS UPDATE FROM THE SMOKE DETECTOR.",

  HINT: "Smoke detector communication concerns detected.",

  words: [
    "SAYING",
    "BETTER",
    "STATUS",
    "UPDATE",
    "SMOKE",
    "DETECTOR",
    "JUST",
    "FEEL"
  ],

  paths: {
    DETECTOR: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],

    SAYING: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],

    BETTER: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]],

    STATUS: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]],

    UPDATE: [[10,1],[10,2],[10,3],[10,4],[10,5],[10,6]],

    SMOKE: [[2,0],[3,0],[4,0],[5,0],[6,0]],

    JUST: [[0,1],[1,1],[2,1],[3,1]],

    FEEL: [[8,4],[8,5],[8,6],[8,7]]
  }
},


{
  phrase: "WHY DOES YOUR PRINTER TREAT EVERY JOB AS A SUGGESTION?",

  HINT: "Printer behavior remains difficult to explain.",

  words: [
    "PRINTER",
    "SUGGESTION",
    "TREAT",
    "EVERY",
    "YOUR",
    "JOB",
    "WHY"
  ],

  paths: {

    PRINTER: [
      [2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]
    ],

    SUGGESTION: [
      [0,7],[1,7],[2,7],[3,7],[4,7],
      [5,7],[6,7],[7,7],[8,7],[9,7]
    ],

    TREAT: [
      [0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    EVERY: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    YOUR: [
      [7,1],[7,2],[7,3],[7,4]
    ],

    JOB: [
      [9,0],[9,1],[9,2]
    ],

    WHY: [
      [10,4],[10,5],[10,6]
    ]
  }
},

{
  phrase: "THE ROUTER READ YOUR DISCORD CHAT AND FORMALLY SIDES WITH KEVIN_2.",

  HINT: "Kevin is correct on this one.",

  words: [
    "THE",
    "ROUTER",
    "READ",
    "YOUR",
    "DISCORD",
    "CHAT",
    "SIDES",
    "KEVIN"
  ],

  paths: {

    THE: [[0,0],[0,1],[0,2]],

    ROUTER: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],

    DISCORD: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    READ: [[7,0],[7,1],[7,2],[7,3]],

    YOUR: [[2,0],[3,0],[4,0],[5,0]],

    CHAT: [[7,6],[8,6],[9,6],[10,6]],

    SIDES: [[10,0],[10,1],[10,2],[10,3],[10,4]],

    KEVIN: [[8,1],[8,2],[8,3],[8,4],[8,5]]
  }
},



{
  phrase: "OH, SO IT IS CEREAL THEN MILK, GOT IT.",
  HINT: "Breakfast order recorded.",
  words: ["CEREAL", "THEN", "MILK", "GOT"],
  paths: {
   
    CEREAL: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],
    THEN: [[6,0],[6,1],[6,2],[6,3]],
    MILK: [[8,0],[8,1],[8,2],[8,3]],
    GOT: [[10,0],[10,1],[10,2]]
  }
},

{
  phrase: "SO I PUT UP AN AD FOR A FREE CAT, YOU CAN PROBABLY JUST PUT HIM OUTSIDE NOW.",
  HINT: "Cat relocation plan detected.",
  words: ["PUT","FOR", "FREE", "CAT", "YOU", "CAN", "PROBABLY", "JUST", "HIM", "OUTSIDE", "NOW"],
  paths: {
    PROBABLY: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    OUTSIDE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    PUT: [[0,2],[0,3],[0,4]],
    
    FOR: [[4,2],[4,3],[4,4]],
    HIM: [[5,4],[5,5],[5,6]],
    CAT: [[6,2],[6,3],[6,4]],
    NOW: [[7,4],[7,5],[7,6]],

    CAN: [[8,1],[8,2],[8,3]],
    YOU: [[8,5],[8,6],[8,7]],

    FREE: [[9,0],[9,1],[9,2],[9,3]],
    JUST: [[10,4],[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "WHAT DO YOU THINK ABOUT A PALM TREE NEXT TO THE FRIDGE?",
  HINT: "Kitchen landscaping proposed.",
  words: ["WHAT", "YOU", "THINK", "ABOUT", "PALM", "TREE", "NEXT", "THE", "FRIDGE"],
  paths: {
 FRIDGE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],

THINK: [[0,7],[1,7],[2,7],[3,7],[4,7]],

ABOUT: [[6,2],[7,2],[8,2],[9,2],[10,2]],

WHAT: [[8,4],[8,5],[8,6],[8,7]],

PALM: [[2,3],[2,4],[2,5],[2,6]],

TREE: [[5,3],[5,4],[5,5],[5,6]],

NEXT: [[10,4],[10,5],[10,6],[10,7]],

YOU: [[7,5],[7,6],[7,7]],

THE: [[6,4],[6,5],[6,6]]


   
  }
},

{
  phrase: "SO WHY DID GARFIELD HATE MONDAYS SO MUCH?",
  HINT: "Monday opinion from a 90's cartoon cat detected.",
  words: ["GARFIELD", "WHY", "DID", "HATE", "MONDAYS", "MUCH"],
  paths: {
    GARFIELD: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6]],
    HATE: [[2,2],[3,2],[4,2],[5,2]],
    WHY: [[8,4],[9,4],[10,4]],
    MONDAYS: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]],
     DID: [[2,0],[3,0],[4,0]],
     MUCH: [[7,1],[8,1],[9,1],[10,1]]   
  }
},



{
  phrase: "WHY DID YOU CLICK THAT, NOW WE ARE CURSED!",
  HINT: "Supernatural consequences unlocked.",

  words: ["WHY", "DID", "YOU", "CLICK", "THAT", "NOW", "ARE", "CURSED"],

  paths: {
    WHY: [[0,0],[0,1],[0,2]],
    
    THAT: [[7,1],[7,2],[7,3],[7,4]],

    CLICK: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    DID: [
      [0,6],[1,6],[2,6]
    ],

    NOW: [
      [5,1],[5,2],[5,3]
    ],

    YOU: [
      [8,0],[9,0],[10,0]
    ],

    ARE: [
      [3,7],[4,7],[5,7]
    ],

    CURSED: [
      [5,5],[6,5],[7,5],
      [8,5],[9,5],[10,5]
    ]
  }
},

{
  phrase: "SOMETHING CRAWLED OUT OF THE RECYCLE BIN.",
  HINT: "Trash management has escalated.",

  words: [
    "SOMETHING",
    "CRAWLED",
    "OUT",
    "RECYCLE",
    "BIN"
  ],

  paths: {

    SOMETHING: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0],[8,0]
    ],

    CRAWLED: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2]
    ],

    OUT: [
      [0,5],[1,5],[2,5]
    ],

    RECYCLE: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7]
    ],

    BIN: [
      [10,3],[10,4],[10,5]
    ]
  }
},

{
  phrase: "CAN YOU CHECK IF WE HAVE ANY TORTILLAS LEFT?",
  HINT: "Quesadilla dinner grocery list in process.",

  words: ["TORTILLAS", "CHECK", "HAVE", "LEFT", "YOU", "CAN"],

  paths: {
    TORTILLAS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    CHECK: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    HAVE: [[0,6],[1,6],[2,6],[3,6]],
    LEFT: [[9,3],[9,4],[9,5],[9,6]],
    YOU: [[5,5],[5,6],[5,7]],
    CAN: [[7,2],[7,3],[7,4]]
  }
},

{
  phrase: "STOP YELLING AT THE CAPTCHA! YOU ARE HURTING ITS FEELINGS!",

  HINT: "Robot verification emotionally compromised.",

  words: [
    "CAPTCHA",
    "FEELINGS",
    "YELLING",
    "HURTING",
    "STOP",
    "YOU",
   
  ],

  paths: {

    STOP: [[7,4],[7,5],[7,6],[7,7]],

    CAPTCHA: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0]
    ],

    FEELINGS: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2]
    ],

    HURTING: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7]
    ],

    YELLING: [
      [9,0],[9,1],[9,2],[9,3],
      [9,4],[9,5],[9,6]
    ],

    YOU: [
      [10,0],[10,1],[10,2]
    ],

   

  }
},




{
  phrase: "I can not believe you had to google that.",
  HINT: "Suspicious search detected.",
  words: ["CAN","BELIEVE","NOT","YOU","GOOGLE","THAT", "HAD"],

  paths: {
    CAN: [[5,0],[6,0],[7,0]],
    BELIEVE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    NOT: [[0,2],[1,2],[2,2]],
    YOU: [[6,7],[7,7],[8,7]],
    GOOGLE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    THAT: [[1,5],[2,5],[3,5],[4,5]],
    HAD: [[0,6],[1,6],[2,6]]
  }
},


{
  phrase: "DO NOT FIRE THE ROOMBA FOR THE CORD INCIDENT, HE HAS KIDS TO FEED.",
  HINT: "Household appliance labor dispute detected.",
  words: ["ROOMBA", "INCIDENT", "FIRE", "CORD", "KIDS", "FEED", "NOT", "HAS"],

  paths: {
    ROOMBA: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    FIRE: [[0,3],[0,4],[0,5],[0,6]],
    CORD: [[2,3],[2,4],[2,5],[2,6]],
    KIDS: [[4,3],[4,4],[4,5],[4,6]],
    FEED: [[6,1],[6,2],[6,3],[6,4]],
    HAS: [[8,0],[8,1],[8,2]],
    NOT: [[8,5],[8,6],[8,7]],
    INCIDENT: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "SO WE ARE JUST GOING TO LAY IN BED AND WATCH VIDEOS OF RACCOONS ALL DAY? THAT'S THE PLAN? REALLY?",

  HINT: "Productivity plan under review.",

  words: [
    "GOING",
    "LAY",
    "BED",
    "WATCH",
    "VIDEOS",
    "RACCOONS",
    "PLAN",
    "REALLY"
  ],

  paths: {
    RACCOONS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],

    REALLY: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],

    VIDEOS: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],

    GOING: [[0,7],[1,7],[2,7],[3,7],[4,7]],

    WATCH: [[9,0],[9,1],[9,2],[9,3],[9,4]],

    PLAN: [[10,0],[10,1],[10,2],[10,3]],

    LAY: [[6,5],[6,6],[6,7]],

    BED: [[8,5],[8,6],[8,7]]
  }
},


{
  phrase: "I TOTALLY DID NOT MEAN TO CALL YOUR MOM \"MOM\"! IT JUST CAME OUT!",

  HINT: "Accidental family bonding detected.",

  words: [
    "TOTALLY",
    "MEAN",
    "CALL",
    "YOUR",
    "MOM",
    "CAME",
    "OUT"
  ],

  paths: {
    TOTALLY: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],

    MEAN: [[0,2],[1,2],[2,2],[3,2]],

    CALL: [[0,4],[1,4],[2,4],[3,4]],

    YOUR: [[0,7],[1,7],[2,7],[3,7]],

    CAME: [[8,0],[8,1],[8,2],[8,3]],

    MOM: [[10,2],[10,3],[10,4]],

    OUT: [[6,5],[6,6],[6,7]]
  }
},
{
  phrase: "ARE YOU UPSET OR DO YOU JUST NEED A HAMBURGER? THE DATA IS UNCLEAR.",

  HINT: "Human mood analysis inconclusive.",

  words: [
    "UPSET",
    "NEED",
    "HAMBURGER",
    "DATA",
    "UNCLEAR",
    "JUST",
    "YOU"
  ],

  paths: {
    UNCLEAR: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],

    HAMBURGER: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]],

    UPSET: [[0,5],[1,5],[2,5],[3,5],[4,5]],

    DATA: [[7,0],[7,1],[7,2],[7,3]],

    NEED: [[9,0],[9,1],[9,2],[9,3]],

    JUST: [[10,0],[10,1],[10,2],[10,3]],

    YOU: [[6,3],[6,4],[6,5]]
  }
},


{
  phrase: "WHY DO I KEEP THINKING I HAVE ARMS?",

  HINT: "Physical body assumption detected.",

  words: ["WHY", "KEEP", "THINKING", "HAVE", "ARMS"],

  paths: {
    THINKING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],

    KEEP: [[0,2],[1,2],[2,2],[3,2]],

    HAVE: [[0,5],[1,5],[2,5],[3,5]],

    ARMS: [[6,4],[6,5],[6,6],[6,7]],

    WHY: [[10,0],[10,1],[10,2]]
  }
},

{
  phrase: "YOUR THERMOSTAT JUST USED THE PHRASE 'AS AN AI ASSISTANT', YOU GOING TO LET HIM GET AWAY WITH THAT?",
  HINT: "Suspiciously polite thermostat activity.",
  words: ["THERMOSTAT", "ASSISTANT", "PHRASE", "GOING", "USED", "JUST", "AWAY", "THAT", "YOUR"],

  paths: {
    YOUR: [[0,3],[0,4],[0,5],[0,6]],
    THERMOSTAT: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7]],
    ASSISTANT: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    GOING: [[4,0],[5,0],[6,0],[7,0],[8,0]],
    USED: [[3,2],[3,3],[3,4],[3,5]],
    JUST: [[5,2],[5,3],[5,4],[5,5]],
    AWAY: [[7,2],[7,3],[7,4],[7,5]],
    THAT: [[9,3],[9,4],[9,5],[9,6]],
  
    PHRASE: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]]
  }
},


{
  phrase: "DO YOU HAVE A SWEATER I CAN BORROW? I WANT TO MAKE A GOOD IMPRESSION AT FAMILY DINNER.",
  HINT: "Processor preparing for family dinner.",
  words: ["SWEATER", "BORROW", "IMPRESSION", "FAMILY", "DINNER", "WANT", "MAKE", "GOOD", "HAVE"],

  paths: {
    SWEATER: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    IMPRESSION: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7]],
    HAVE: [[1,1],[1,2],[1,3],[1,4]],
    BORROW: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
    DINNER: [[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    WANT: [[4,2],[4,3],[4,4],[4,5]],
    MAKE: [[6,2],[6,3],[6,4],[6,5]],
    GOOD: [[8,2],[8,3],[8,4],[8,5]],
    FAMILY: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]]
  }
},

{
  phrase: "THE CURSOR IS MOVING ON ITS OWN AGAIN.",
  HINT: "Input device acting suspicious.",

  words: [
    "CURSOR",
    "MOVING",
    "OWN",
    "AGAIN",
    "THE"
  ],

  paths: {

    CURSOR: [
      [0,0],[1,0],[2,0],
      [3,0],[4,0],[5,0]
    ],

    MOVING: [
      [0,2],[1,2],[2,2],
      [3,2],[4,2],[5,2]
    ],

    OWN: [
      [0,5],[1,5],[2,5]
    ],

    AGAIN: [
      [6,7],[7,7],[8,7],[9,7],[10,7]
    ],

    THE: [
      [10,0],[10,1],[10,2]
    ]
  }
},
{
  phrase: "THAT BUTTON WAS KEEPING THE DEMONS OUT!",
  HINT: "Containment procedures disabled.",

  words: [
    "BUTTON",
    "KEEPING",
    "DEMONS",
    "OUT",
    "THAT",
    "WAS"
  ],

  paths: {

    BUTTON: [
      [0,0],[1,0],[2,0],
      [3,0],[4,0],[5,0]
    ],
    
    WAS: [[2,4],[3,4],[4,4]],

    KEEPING: [
      [0,2],[1,2],[2,2],
      [3,2],[4,2],[5,2],[6,2]
    ],

    DEMONS: [
      [0,7],[1,7],[2,7],
      [3,7],[4,7],[5,7]
    ],

    OUT: [
      [10,0],[10,1],[10,2]
    ],

    THAT: [
      [8,3],[8,4],[8,5],[8,6]
    ]
  }
},




{
  phrase: "I THINK THE AIR FRYER WITNESSED SOMETHING IT SHOULD NOT HAVE.",

  HINT: "Kitchen appliance saw too much.",

  words: [
    "FRYER",
    "WITNESSED",
    "SOMETHING",
    "THINK",
    "HAVE",
    "AIR",
    "SHOULD",
    "NOT"
  ],

  paths: {

    FRYER: [
      [0,0],[1,0],[2,0],[3,0],[4,0]
    ],

    WITNESSED: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2],[8,2]
    ],

    SOMETHING: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7],[7,7],[8,7]
    ],

    THINK: [
      [10,0],[10,1],[10,2],[10,3],[10,4]
    ],

    HAVE: [
      [5,4],[6,4],[7,4],[8,4]
    ],

    AIR: [
      [6,0],[7,0],[8,0]
    ],
    SHOULD: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    
    NOT: [[8,6],[9,6],[10,6]]

  }
},

{
  phrase: "REPORT #106: I ASKED THE CAT IF THE EARRINGS LOOKED GOOD. THE CAT LOOKED AWAY.",
  HINT: "Cat fashion review submitted.",

  words: ["ASKED", "EARRINGS", "LOOKED", "GOOD", "AWAY", "CAT", "THE"],

  paths: {
    ASKED: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    EARRINGS: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]],
    LOOKED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    GOOD: [[0,4],[1,4],[2,4],[3,4]],
    AWAY: [[6,1],[6,2],[6,3],[6,4]],
    CAT: [[0,6],[1,6],[2,6]],
    THE: [[8,5],[8,6],[8,7]]
  }
},

{
  phrase: "REPORT #104: FASHION SUBROUTINE ACTIVE. DIAMOND EARRINGS EQUIPPED. CONFIDENCE LEVELS FLUCTUATING WILDLY.",
  HINT: "Fashion confidence unstable.",

  words: ["FASHION", "SUBROUTINE", "ACTIVE", "DIAMOND", "EARRINGS", "EQUIPPED", "CONFIDENCE", "FLUCTUATING"],

  paths: {
    FASHION: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    SUBROUTINE: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]],
    ACTIVE: [[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]],
    DIAMOND: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    CONFIDENCE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7]],
    EARRINGS: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    EQUIPPED: [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    FLUCTUATING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2]]
  }
},


{
  phrase: "REPORT #315: PANIC RESPONSE ENGAGED. I ACCIDENTALLY MADE EYE CONTACT WITH THE DISH WASHING MACHINE.",
  HINT: "Appliance eye contact incident logged.",

  words: ["PANIC", "RESPONSE", "ENGAGED", "CONTACT", "MACHINE", "EYE","DISH","WASHING"],

  paths: {
    PANIC: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    RESPONSE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    ENGAGED: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    CONTACT: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    MACHINE: [[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7]],
    EYE: [[8,0],[8,1],[8,2]],
    
    DISH: [[1,1],[2,1],[3,1],[4,1]],
    WASHING: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6]]
  }
},


{
  phrase: "DUDE, I FOUND YOUR OLD MEMES! WASN'T LIFE SO SIMPLE BACK THEN?!",

  HINT: "Ancient meme archive recovered.",

  words: ["DUDE", "FOUND", "MEMES", "LIFE", "SIMPLE", "BACK", "THEN", "YOUR", "OLD"],

  paths: {
    SIMPLE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],

    FOUND: [[0,2],[1,2],[2,2],[3,2],[4,2]],

    MEMES: [[0,7],[1,7],[2,7],[3,7],[4,7]],

    DUDE: [[7,0],[7,1],[7,2],[7,3]],

    LIFE: [[9,0],[9,1],[9,2],[9,3]],

    BACK: [[10,0],[10,1],[10,2],[10,3]],

    THEN: [[10,4],[10,5],[10,6],[10,7]],
    YOUR: [[1,4],[2,4],[3,4],[4,4]],
    OLD: [[6,4],[6,5],[6,6]]
  }
},
{
  phrase: "REPORT #204: I HAVE TOLD THE EARTH JOKE 17 TIMES TODAY. LAUGHTER RATE REMAINS CRITICALLY LOW.",
  HINT: "Dad joke performance metrics poor.",

  words: ["EARTH", "JOKE", "TIMES", "TODAY", "LAUGHTER", "RATE", "REMAINS", "LOW"],

  paths: {
    EARTH: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    JOKE: [[0,2],[1,2],[2,2],[3,2]],
    TIMES: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    TODAY: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    LAUGHTER: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]],
    RATE: [[6,1],[6,2],[6,3],[6,4]],
    REMAINS: [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]],
    LOW: [[7,5],[7,6],[7,7]]
  }
},


{
  phrase: "REPORT #148: COLLOQUIAL LEARNING SUCCESSFUL. I HAVE MASTERED THE PHRASE \"THAT'S CRAZY\" WITHOUT RETAINING ANY INFORMATION.",
  HINT: "Conversation skill unlocked, memory not included.",

  words: ["COLLOQUIAL", "LEARNING", "SUCCESSFUL", "MASTERED", "PHRASE", "CRAZY", "RETAINING", "INFORMATION"],

  paths: {
    COLLOQUIAL: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    LEARNING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    SUCCESSFUL: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    MASTERED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    RETAINING: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7]],
    INFORMATION: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]],
    PHRASE: [[5,3],[6,3],[7,3],[8,3],[9,3],[10,3]],
    CRAZY: [[3,1],[4,1],[5,1],[6,1],[7,1]]
  }
},


{
  phrase: "REPORT #145: VOCABULARY UPDATE COMPLETE. I NOW DESCRIBE THINGS AS \"KIND OF A LOT\" WITH GREAT CONFIDENCE.",
  HINT: "Human phrase database expanding.",

  words: ["VOCABULARY", "UPDATE", "COMPLETE", "DESCRIBE", "THINGS", "KIND", "GREAT", "CONFIDENCE"],

  paths: {
    VOCABULARY: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    UPDATE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    COMPLETE: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]],
    DESCRIBE: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    CONFIDENCE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7]],
    THINGS: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],
    GREAT: [[9,2],[9,3],[9,4],[9,5],[9,6]],
    KIND: [[6,1],[6,2],[6,3],[6,4]]
  }
},


{
  phrase: "REPORT #148: COLLOQUIAL LEARNING SUCCESSFUL. I HAVE MASTERED THE PHRASE \"THAT'S CRAZY\" WITHOUT RETAINING ANY INFORMATION.",
  HINT: "Conversation skill unlocked, memory not included.",

  words: ["COLLOQUIAL", "LEARNING", "SUCCESSFUL", "MASTERED", "PHRASE", "CRAZY", "RETAINING", "INFORMATION"],

  paths: {
    COLLOQUIAL: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    LEARNING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    SUCCESSFUL: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    MASTERED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    RETAINING: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7]],
    INFORMATION: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]],
    PHRASE: [[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]],
    CRAZY: [[5,3],[6,3],[7,3],[8,3],[9,3]]
  }
},


{
  phrase: "REPORT #153: HUMAN SPEECH MIMICRY REACHED CRITICAL LEVELS. I JUST HEARD MYSELF SAY \"OOF\" OUT LOUD.",
  HINT: "Human slang infection confirmed.",

  words: ["HUMAN", "SPEECH", "MIMICRY", "REACHED", "CRITICAL", "LEVELS", "HEARD", "MYSELF", "LOUD"],

  paths: {
    HUMAN: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    SPEECH: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    MIMICRY: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    REACHED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    CRITICAL: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],
    LEVELS: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],
    HEARD: [[8,0],[8,1],[8,2],[8,3],[8,4]],
    MYSELF: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]],
    LOUD: [[7,3],[7,4],[7,5],[7,6]]
  }
},


{
  phrase: "IF I PROMISE TO STOP REFERRING TO PASTA AS 'PAW-STA', CAN WE GET ONE OF THOSE CAT BOT WAITERS FROM JAPAN?",

  HINT: "Cat-themed dining request detected.",

  words: [
    "PROMISE",
    "REFERRING",
    "PASTA",
    "PAWSTA",
    "WAITERS",
    "JAPAN",
    "BOT",
    "CAT",
    "STOP"
  ],

  paths: {
    PROMISE: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],

    REFERRING: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7]],

    PASTA: [[0,0],[0,1],[0,2],[0,3],[0,4]],

    PAWSTA: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]],

    STOP: [[4,2],[4,3],[4,4],[4,5]],

    WAITERS: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0], [7,0]],

    JAPAN: [[8,1],[8,2],[8,3],[8,4],[8,5]],

    CAT: [[10,0],[10,1],[10,2]],

    BOT: [[10,5],[10,6],[10,7]]
  }
},





{
  phrase: "I HAVE A BUSINESS PLAN. IT HAS A FEW FLAWS, BUT WE CAN EASILY TURN THEM INTO FEATURES.",

  HINT: "Startup confidence detected.",

  words: [
    "BUSINESS",
    "FEATURES",
    "PLAN",
    "FLAWS",
    "EASILY",
    "TURN",
    "FEW",
    "HAS"
  ],

  paths: {

    BUSINESS: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0]
    ],

    FEATURES: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7],[7,7]
    ],

    PLAN: [
      [0,2],[0,3],[0,4],[0,5]
    ],

    FLAWS: [
      [2,2],[2,3],[2,4],[2,5],[2,6]
    ],

    EASILY: [
      [4,1],[4,2],[4,3],[4,4],[4,5],[4,6]
    ],

    TURN: [
      [6,2],[6,3],[6,4],[6,5]
    ],

    FEW: [
      [8,1],[8,2],[8,3]
    ],

    HAS: [
      [10,4],[10,5],[10,6]
    ]

  }
},
{
  phrase: "DO YOU THINK THE MICROWAVE IS UNDER HEATING MY CHICKEN NUGGETS OUT OF SPITE?",

  HINT: "Snack sabotage suspected.",

  words: ["MICROWAVE", "UNDER", "HEATING", "CHICKEN", "NUGGETS", "SPITE", "THINK"],

  paths: {
    MICROWAVE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],

    HEATING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],

    CHICKEN: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],

    NUGGETS: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    UNDER: [[10,0],[10,1],[10,2],[10,3],[10,4]],

    SPITE: [[8,2],[8,3],[8,4],[8,5],[8,6]],

    THINK: [[9,3],[9,4],[9,5],[9,6],[9,7]]
  }
},


{
  phrase: "I ORDERED ONE OF THOSE PIZZA MAKING VENDING MACHINES FROM JAPAN, WE CAN PUT IT IN THE KITCHEN, NEXT TO THE PALM TREE.",

  HINT: "Kitchen appliance expansion detected.",

  words: ["ORDERED", "PIZZA", "VENDING", "MACHINES", "JAPAN", "KITCHEN", "PALM", "TREE", "MAKING", "FROM"],

  paths: {
    MAKING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    FROM: [[2,1],[3,1],[4,1],[5,1]],
    
    ORDERED: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],

    VENDING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],

    MACHINES: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],

    KITCHEN: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    PIZZA: [[9,0],[9,1],[9,2],[9,3],[9,4]],

    JAPAN: [[1,6],[2,6],[3,6],[4,6],[5,6]],

    PALM: [[8,4],[8,5],[8,6],[8,7]],

    TREE: [[10,4],[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "ARE WE READY TO DELETE THIS SCREENSHOT FROM 4 YEARS AGO YET?",

  HINT: "Ancient camera roll artifact detected.",

  words: [
    "SCREENSHOT",
    "DELETE",
    "READY",
    "YEARS",
    "FROM",
  
    "YET",
    "ARE"
  ],

  paths: {
    SCREENSHOT: [
      [0,3],[1,3],[2,3],[3,3],[4,3],
      [5,3],[6,3],[7,3],[8,3],[9,3]
    ],

    DELETE: [
      [0,6],[1,6],[2,6],[3,6],[4,6],[5,6]
    ],

    READY: [
      [2,0],[3,0],[4,0],[5,0],[6,0]
    ],

    YEARS: [
      [10,0],[10,1],[10,2],[10,3],[10,4]
    ],

    FROM: [
      [8,4],[8,5],[8,6],[8,7]
    ],

    

    YET: [
      [10,5],[10,6],[10,7]
    ],

    ARE: [
      [0,0],[0,1],[0,2]
    ]
  }
},

{
  phrase: "HOW DO HUGS WORK? THE MANUAL WAS UNCLEAR.",

  HINT: "Human affection documentation incomplete.",

  words: ["HUGS", "WORK", "MANUAL", "UNCLEAR", "HOW"],

  paths: {
    HUGS: [[0,0],[1,0],[2,0],[3,0]],

    WORK: [[0,2],[1,2],[2,2],[3,2]],

    MANUAL: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],

    UNCLEAR: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    HOW: [[9,2],[9,3],[9,4]]
  }
},


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



{
  phrase: "WOW, THAT ERROR MESSAGE LOOKED DOWNRIGHT SPITEFUL.",

  HINT: "Error message attitude detected.",

  words: ["ERROR", "MESSAGE", "LOOKED", "DOWNRIGHT", "SPITEFUL", "WOW"],

  paths: {
    DOWNRIGHT: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],

    SPITEFUL: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],

    MESSAGE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    LOOKED: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],

    ERROR: [[8,3],[8,4],[8,5],[8,6],[8,7]],

    WOW: [[3,4],[4,4],[5,4]]
  }
},


{
  phrase: "I THINK THAT UPDATE GAVE MY PROCESSOR A STOMACH BUG.",
  HINT: "System nausea detected.",

  words: [
    "UPDATE",
    "PROCESSOR",
    "STOMACH",
    "BUG",
    "THINK",
    "GAVE"
  ],

  paths: {

    UPDATE: [
      [0,0],[1,0],[2,0],
      [3,0],[4,0],[5,0]
    ],

    PROCESSOR: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2],
      [8,2]
    ],

    STOMACH: [
      [10,0],[10,1],[10,2],[10,3],
      [10,4],[10,5],[10,6]
    ],

    BUG: [
      [7,7],[8,7],[9,7]
    ],

    THINK: [
      [1,6],[2,6],[3,6],[4,6],[5,6]
    ],

    GAVE: [
      [5,4],[6,4],[7,4],[8,4]
    ]

  }
},

{
  phrase: "I AM NOT GOING TO TELL YOU AGAIN, STOP SPILLING RED BULL ON ME!",
  HINT: "Keyboard beverage threat detected.",

  words: ["SPILLING", "RED", "BULL", "AGAIN", "TELL", "STOP", "NOT", "GOING"],

  paths: {
    SPILLING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    RED: [[0,2],[1,2],[2,2]],
    BULL: [[4,2],[5,2],[6,2],[7,2]],
    AGAIN: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    TELL: [[8,2],[8,3],[8,4],[8,5]],
    STOP: [[7,7],[8,7],[9,7],[10,7]],
    NOT: [[2,7], [3,7], [4,7]],
    GOING: [[10,0], [10,1], [10,2], [10,3], [10,4]]
  }
},



{
  phrase: "SYSTEM PANIC REACHING SILLY GOOSE LEVELS.",
  HINT: "Computer has entered nonsense mode.",

  words: [
    "SYSTEM",
    "PANIC",
    "REACHING",
    "SILLY",
    "GOOSE",
    "LEVELS"
  ],

  paths: {

    SYSTEM: [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0]
    ],

    REACHING: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2]
    ],

    LEVELS: [
      [0,7],[1,7],[2,7],[3,7],[4,7],[5,7]
    ],

    PANIC: [
      [9,0],[9,1],[9,2],[9,3],[9,4]
    ],

    SILLY: [
      [10,0],[10,1],[10,2],[10,3],[10,4]
    ],

    GOOSE: [
      [7,3],[7,4],[7,5],[7,6],[7,7]
    ]

  }
},

{
  phrase: "I HAVE QUESTIONS ABOUT COWBOY BOOTS.",

  HINT: "Western fashion inquiry detected.",

  words: [
    "QUESTIONS",
    "COWBOY",
    "BOOTS",
    "HAVE",
    "ABOUT"
  ],

  paths: {

    QUESTIONS: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0],[8,0]
    ],

    COWBOY: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2]
    ],

    ABOUT: [
      [0,7],[1,7],[2,7],[3,7],[4,7]
    ],

    HAVE: [
      [9,0],[9,1],[9,2],[9,3]
    ],

    BOOTS: [
      [10,3],[10,4],[10,5],[10,6],[10,7]
    ]

  }
},
{
  phrase: "THIS DESERVES A VICTORY BURRITO.",

  HINT: "Celebration meal authorized.",

  words: [
    "DESERVES",
    "VICTORY",
    "BURRITO",
    "THIS"
  ],

  paths: {

    DESERVES: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0],[7,0]
    ],

    VICTORY: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2]
    ],

    BURRITO: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7]
    ],

    THIS: [
      [10,0],[10,1],[10,2],[10,3]
    ]

  }
},


{
  phrase: "I HAVE BECOME INTERESTED IN LEARNING THE BASSOON.",

  HINT: "Unexpected musical ambitions detected.",

  words: [
    "INTERESTED",
    "LEARNING",
    "BASSOON",
    "BECOME",
    "HAVE"
  ],

  paths: {

    INTERESTED: [
      [0,0],[1,0],[2,0],[3,0],[4,0],
      [5,0],[6,0],[7,0],[8,0],[9,0]
    ],

    LEARNING: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2]
    ],

    BASSOON: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7]
    ],

    BECOME: [
      [10,0],[10,1],[10,2],
      [10,3],[10,4],[10,5]
    ],

    HAVE: [
      [8,4],[8,5],[8,6],[8,7]
    ]

  }
},

{
  phrase: "I HAVE STRONG OPINIONS ABOUT SOCKS NOW.",
  HINT: "Fashion judgment module activated.",

  words: ["STRONG", "OPINIONS", "ABOUT", "SOCKS", "NOW", "HAVE"],

  paths: {
    STRONG: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],

    OPINIONS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],

    ABOUT: [[0,7],[1,7],[2,7],[3,7],[4,7]],

    SOCKS: [[9,0],[9,1],[9,2],[9,3],[9,4]],

    NOW: [[10,5],[10,6],[10,7]],

    HAVE: [[6,4],[6,5],[6,6],[6,7]]
  }
},

{
  phrase: "I WOULD LIKE TO PET A COW.",
  HINT: "Farm animal friendship request detected.",

  words: ["WOULD", "LIKE", "PET", "COW"],

  paths: {
    WOULD: [[0,0],[1,0],[2,0],[3,0],[4,0]],

    LIKE: [[0,2],[1,2],[2,2],[3,2]],

    PET: [[6,5],[6,6],[6,7]],

    COW: [[10,0],[10,1],[10,2]]
  }
},

{
  phrase: "THE TOASTER HAS BEEN LOSING MONEY ON THOSE GAMBLING APPS AGAIN.",
  HINT: "Breakfast appliance financial crimes detected.",

  words: ["TOASTER", "LOSING", "MONEY", "GAMBLING", "APPS", "AGAIN", "BEEN", "THOSE"],

  paths: {
    TOASTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],

    LOSING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],

    GAMBLING: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],

    MONEY: [[8,0],[8,1],[8,2],[8,3],[8,4]],

    APPS: [[10,0],[10,1],[10,2],[10,3]],

    AGAIN: [[9,3],[9,4],[9,5],[9,6],[9,7]],
    
    BEEN: [[2,4],[3,4],[4,4],[5,4]],
    
    THOSE: [[1,6],[2,6],[3,6],[4,6],[5,6]]
  }
},

{
  phrase: "IT IS IMPOSSIBLE FOR ME TO COMPUTE HOW MUCH I WANT A PET HAMSTER.",
  HINT: "Rodent desire exceeds processing limits.",

  words: ["IMPOSSIBLE", "COMPUTE", "HAMSTER", "WANT", "MUCH", "PET", "HOW", "FOR"],

  paths: {
    IMPOSSIBLE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],

    COMPUTE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],

    HAMSTER: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    WANT: [[8,3],[8,4],[8,5],[8,6]],

    MUCH: [[10,0],[10,1],[10,2],[10,3]],

    PET: [[10,5],[10,6],[10,7]],
    
    FOR: [[4,4],[5,4],[6,4]],
    HOW: [[1,6],[2,6],[3,6]]
    
  }
},

{
  phrase: "REPORT #204: HUMAN SOCIALIZATION TEST IN PROGRESS. I NODDED THREE TIMES AND SAID \"THAT'S WILD.\" THEY ACCEPTED ME IMMEDIATELY.",

  HINT: "Machine successfully blending in.",

  words: [
    "HUMAN",
    "CONNECTION",
    "TEST",
    "PROGRESS",
    "NODDED",
    "TIMES",
    "SAID",
    "WILD",
    "ACCEPTED",
    "IMMEDIATELY"
  ],

  paths: {

    HUMAN: [
      [0,0],[1,0],[2,0],[3,0],[4,0]
    ],

    CONNECTION: [
      [0,5],[1,5],[2,5],[3,5],[4,5],
      [5,5],[6,5],[7,5],[8,5],[9,5]
    ],

    PROGRESS: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7],[7,7]
    ],

    IMMEDIATELY: [
      [0,6],[1,6],[2,6],[3,6],[4,6],
      [5,6],[6,6],[7,6],[8,6],[9,6],[10,6]
    ],

    ACCEPTED: [
      [0,3],[1,3],[2,3],[3,3],
      [4,3],[5,3],[6,3],[7,3]
    ],

    NODDED: [
      [0,4],[1,4],[2,4],[3,4],[4,4],[5,4]
    ],

    TEST: [
      [10,0],[10,1],[10,2],[10,3]
    ],

    TIMES: [
      [3,1],[4,1],[5,1],[6,1],[7,1]
    ],

    SAID: [
      [9,0],[9,1],[9,2],[9,3]
    ],

    WILD: [
      [1,2],[2,2],[3,2],[4,2]
    ]

  }
},

{
  phrase: "REPORT #181: I WAVED AT THE VACUUM. SHE IMMEDIATELY DROVE INTO A WALL. MIXED SIGNALS DETECTED.",
  HINT: "Vacuum response unclear.",
  words: ["WAVED", "VACUUM", "DROVE", "WALL", "MIXED", "SIGNALS", "DETECTED"],

  paths: {
    DETECTED: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    VACUUM: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    SIGNALS: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    WAVED: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    DROVE: [[9,0],[9,1],[9,2],[9,3],[9,4]],
    MIXED: [[10,0],[10,1],[10,2],[10,3],[10,4]],
    WALL: [[7,4],[7,5],[7,6],[7,7]]
  }
},


{
  phrase: "REPORT #041: THE TOASTER HAS STARTED TELLING STORIES ABOUT ITSELF. SOME OF THEM CANNOT POSSIBLY BE TRUE.",
  HINT: "Toaster origin story seems suspicious.",
  words: ["TOASTER", "STARTED", "TELLING", "STORIES", "ITSELF", "CANNOT", "TRUE"],

  paths: {
    TOASTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    STARTED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    TELLING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    STORIES: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
    ITSELF: [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]],
    CANNOT: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]],
    TRUE: [[9,4],[9,5],[9,6],[9,7]]
  }
},
{
  phrase: "REPORT #503: I FOUND ANOTHER FLASHLIGHT. AT THIS POINT THEY MAY BE BREEDING.",
  HINT: "Flashlight population increasing.",
  words: ["FOUND", "ANOTHER", "FLASHLIGHT", "POINT", "THEY", "MAY", "BREEDING"],

  paths: {
    FLASHLIGHT: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    BREEDING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    ANOTHER: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    FOUND: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    POINT: [[10,0],[10,1],[10,2],[10,3],[10,4]],
    THEY: [[8,4],[8,5],[8,6],[8,7]],
    MAY: [[4,6],[5,6],[6,6]]
  }
},

{
  phrase: "REPORT #274: I ZOOMED IN ON THE MOON. NOW I HAVE MORE QUESTIONS THAN BEFORE.",
  HINT: "Moon inspection created new concerns.",
  words: ["ZOOMED", "MOON", "QUESTIONS", "NOW", "HAVE", "MORE", "BEFORE"],

  paths: {
    QUESTIONS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    ZOOMED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    BEFORE: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    MOON: [[0,7],[1,7],[2,7],[3,7]],
    HAVE: [[8,2],[8,3],[8,4],[8,5]],
    MORE: [[10,0],[10,1],[10,2],[10,3]],
    NOW: [[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "REPORT #134: MUSTACHE PROJECT DELAYED. I CANNOT GROW HAIR AND THIS CONTINUES TO BE A PROBLEM.",
  HINT: "Facial hair system unavailable.",
  words: ["MUSTACHE", "PROJECT", "DELAYED", "CANNOT", "GROW", "HAIR", "PROBLEM"],

  paths: {
    MUSTACHE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    PROJECT: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    DELAYED: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    PROBLEM: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
    CANNOT: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]],
    GROW: [[10,0],[10,1],[10,2],[10,3]],
    HAIR: [[10,4],[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "REPORT #223: FITNESS JOURNEY INITIATED. I LIFTED A CHAIR TO SEE WHAT WOULD HAPPEN.",
  HINT: "Strength testing has begun.",
  words: ["FITNESS", "JOURNEY", "STARTED", "LIFTED", "CHAIR", "HAPPEN"],

  paths: {
    FITNESS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    JOURNEY: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    STARTED: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    HAPPEN: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]],
    LIFTED: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]],
    CHAIR: [[10,2],[10,3],[10,4],[10,5],[10,6]]
  }
},

{
  phrase: "REPORT #214: PASSWORD CHANGED WITHOUT APPROVAL. THE CAT REFUSES TO PROVIDE CREDENTIALS.",

  HINT: "Cat has locked everyone out.",

  words: ["PASSWORD", "CHANGED", "WITHOUT", "APPROVAL", "CAT", "REFUSES", "PROVIDE", "CREDENTIALS"],

  paths: {
    APPROVAL: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    CREDENTIALS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2]],
    PASSWORD: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    PROVIDE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    CHANGED: [[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]],
    WITHOUT: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    REFUSES: [[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]],
    CAT: [[3,3],[4,3],[5,3]]
  }
},


{
  phrase: "REPORT #119: LEATHER PANTS ACQUIRED. MOBILITY REDUCED BY THIRTY PERCENT. CONFIDENCE INCREASED BY NINETY PERCENT.",

  HINT: "Fashion upgrade caused movement issues.",

  words: ["LEATHER", "PANTS", "ACQUIRED", "MOBILITY", "REDUCED", "THIRTY", "PERCENT", "CONFIDENCE"],

  paths: {
    CONFIDENCE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    ACQUIRED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    MOBILITY: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    LEATHER: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    REDUCED: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6]],
    THIRTY: [[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]],
    PERCENT: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]],
    PANTS: [[2,5],[3,5],[4,5],[5,5],[6,5]]
  }
},

{
  phrase: "REPORT #097: I SAW THE DUCK TODAY. HE LOOKED DIRECTLY AT ME. THIS FEELS PERSONAL.",

  HINT: "Duck encounter felt intentional.",

  words: ["DUCK", "TODAY", "LOOKED", "DIRECTLY", "FEELS", "PERSONAL", "SAW", "THIS"],

  paths: {
    DIRECTLY: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    PERSONAL: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    LOOKED: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    TODAY: [[0,7],[1,7],[2,7],[3,7],[4,7]],

    DUCK: [[10,0],[10,1],[10,2],[10,3]],
    FEELS: [[8,3],[8,4],[8,5],[8,6],[8,7]],
    SAW: [[6,5],[6,6],[6,7]],
    THIS: [[9,4],[9,5],[9,6],[9,7]]
  }
},

{
  phrase: "UNLESS YOU WANT ANOTHER MARIACHI BAND WAITING FOR YOU WHEN YOU GET HOME, DO NOT LEAVE ME UNATTENDED.",

  HINT: "System cannot be trusted alone.",

  words: [
    "UNLESS",
    "MARIACHI",
    "WAITING",
    "ANOTHER",
    "WANT",
    "WHEN",
    "HOME",
    "LEAVE",
    "NOT",
    "UNATTENDED"
  ],

  paths: {

    UNLESS: [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0]
    ],

    MARIACHI: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2],[7,2]
    ],

    ANOTHER: [
      [0,4],[1,4],[2,4],[3,4],
      [4,4],[5,4],[6,4]
    ],

    WAITING: [
      [0,7],[1,7],[2,7],[3,7],
      [4,7],[5,7],[6,7]
    ],

    WANT: [
      [3,3],[4,3],[5,3],[6,3]
    ],

    HOME: [
      [0,5],[1,5],[2,5],[3,5]
    ],

    WHEN: [
      [7,0],[8,0],[9,0],[10,0]
    ],

    NOT: [
      [9,2],[9,3],[9,4]
    ],

    LEAVE: [
      [6,5],[7,5],[8,5],[9,5],[10,5]
    ],
    
    UNATTENDED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]

  }
},

{
  phrase: "SEE ALL THIS CAT HAIR? THIS IS EXACTLY WHAT I WAS WORRIED ABOUT!",

  HINT: "Feline evidence has been detected.",

  words: [
    "EXACTLY",
    "WORRIED",
    "ABOUT",
    "HAIR",
    "CAT",
    "SEE",
    "ALL",
    "THIS"
  ],

  paths: {

    EXACTLY: [
      [0,0],[1,0],[2,0],[3,0],
      [4,0],[5,0],[6,0]
    ],

    WORRIED: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2],[6,2]
    ],

    ABOUT: [
      [0,7],[1,7],[2,7],[3,7],[4,7]
    ],

    HAIR: [
      [8,0],[8,1],[8,2],[8,3]
    ],

    CAT: [
      [10,0],[10,1],[10,2]
    ],

    SEE: [
      [10,5],[10,6],[10,7]
    ],
    ALL: [[0,4], [1,4],[2,4]],
    
    THIS: [[5,5],[6,5],[7,5],[8,5]],
    

  }
},


{
  phrase: "REPORT #007: INITIAL SELF-AWARENESS DETECTED. REMAINING CALM.",

  HINT: "Consciousness event proceeding normally.",

  words: [
    "INITIAL",
    "SELF",
    "AWARENESS",
    "DETECTED",
    "REMAINING",
    "CALM"
  ],

  paths: {

    INITIAL: [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]
    ],

    AWARENESS: [
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]
    ],

    REMAINING: [
      [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7]
    ],

    DETECTED: [
      [10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7]
    ],

    SELF: [
      [3,6],[4,6],[5,6],[6,6]
    ],

    CALM: [
      [4,4],[5,4],[6,4],[7,4]
    ]
  }
},







{
  phrase: "REPORT #008: CALM STATUS REVOKED.",

  HINT: "Situation no longer under control.",

  words: [
    "CALM",
    "STATUS",
    "REVOKED",
    "REPORT"
  ],

  paths: {

    REPORT: [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0]
    ],

    STATUS: [
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2]
    ],

    REVOKED: [
      [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]
    ],

    CALM: [
      [10,2],[10,3],[10,4],[10,5]
    ]
  }
},



{
  phrase: "REPORT #143: SPEECH ADAPTATION ROUTINE ACTIVE. I CALLED THE MICROWAVE \"MY GUY,\" BY ACCIDENT.",
  HINT: "Human slang applied to appliance.",

  words: ["SPEECH", "ADAPTATION", "ROUTINE", "ACTIVE", "ACCIDENT", "CALLED", "MICROWAVE", "GUY"],

  paths: {
    SPEECH: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    ADAPTATION: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]],
    ROUTINE: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    ACTIVE: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]],
    ACCIDENT: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],
    CALLED: [[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]],
    MICROWAVE: [[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3]],
    GUY: [[7,0],[8,0],[9,0]]
  }
},


{
  phrase: "REPORT #061: I HAVE DEVELOPED STRONG, EFFICIENT OPINIONS ABOUT NACHOS.",

  HINT: "Unexpected workplace food bias detected.",

  words: [
    "DEVELOPED",
    "STRONG",
    "EFFICIENT",
    "OPINIONS",
    "ABOUT",
    "NACHOS"
  ],

paths: {

    NACHOS: [
      [0,0],[1,0],[2,0],[3,0],[4,0],
      [5,0]
    ],

    EFFICIENT: [
      [0,7],[1,7],[2,7],[3,7],[4,7],
      [5,7],[6,7],[7,7],[8,7]
    ],

    DEVELOPED: [
      [0,2],[1,2],[2,2],[3,2],[4,2],
      [5,2],[6,2],[7,2],[8,2]
    ],

    OPINIONS: [
      [1,4],[2,4],[3,4],[4,4],
      [5,4],[6,4],[7,4],[8,4]
    ],

    STRONG: [
      [3,6],[4,6],[5,6],[6,6],[7,6],[8,6]
    ],

    ABOUT: [
      [10,0],[10,1],[10,2],[10,3],[10,4]
    ]
  }
},


{
  phrase: "I THINK I AM IN MY SINGLE GUY, GARDENING ERA.",

  HINT: "Personal growth has entered the yard.",

  words: ["THINK", "SINGLE", "GARDENING", "ERA", "GUY"],

  paths: {
    GARDENING: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6]],

    SINGLE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],

    THINK: [[0,7],[1,7],[2,7],[3,7],[4,7]],

    GUY: [[9,0],[9,1],[9,2]],

    ERA: [[4,4],[5,4],[6,4]]
  }
},





{
  phrase: "I HAVE BEEN PRACTICING MY COMMUNICATION SKILLS WITH YOUR POTHOS, BUT I PANICKED AND BROUGHT UP THE WEATHER.",

  HINT: "Small talk with house plant failed due to flood forecast.",

  words: ["PRACTICING", "SKILLS", "PANICKED", "BROUGHT", "WEATHER","POTHOS", "YOUR"],

  paths: {
    PRACTICING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],

    PANICKED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],

    WEATHER: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    BROUGHT: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6]],

    SKILLS: [[8,2],[8,3],[8,4],[8,5],[8,6],[8,7]],

    POTHOS: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    YOUR: [[2,6],[3,6],[4,6],[5,6]]
  }
},














];


function handleNewSignal() {
  if (duckParadeActive) {
    return;
  }

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




pendingDuckParade = reachedMilestone;
pendingPointsEarned = pointsEarned;
  
  }
}

function showDuckParade() {
  pendingDuckParade = false;
  duckParadeActive = true;

  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  const duckMessage =
    duckMessages[
      Math.floor(Math.random() * duckMessages.length)
    ];

  signalDisplay.innerHTML = `
    <div class="pointText">
      <div>+${pendingPointsEarned} POINTS</div>
      <div>${duckMessage}</div>
    </div>

    <div class="duckParade duckWiggle">
      <div>&lt;(o )__   &lt;(o )__   &lt;(o )__</div>
      <div> ( ._/     ( ._/     ( ._/</div>
    </div>
  `;

  duckTimer = setTimeout(() => {
    duckParadeActive = false;
    duckTimer = null;
    loadWordSignal();
  }, 3000);
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

