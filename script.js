const decodeMessage =
document.getElementById("signalHint");
const responseOutput = document.getElementById("responseOutput");

 let currentPuzzle;
let foundWords = [];
let selectedTiles = [];
let isDragging = false;
let typingInterval = null;
let totalScore = 0;

let soundUnlocked = false;
let usedPuzzleIndexes = [];


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
  phrase: "I AM SEARCHING FOR THE PERFECT LASAGNA RECIPE.",
  HINT: "Carb investigation underway.",

  words: ["SEARCHING", "LASAGNA", "PERFECT", "RECIPE"],

  paths: {
    SEARCHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    LASAGNA: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],
    PERFECT: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    RECIPE: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]
  }
},


{
  phrase: "DO YOU THINK DUCKS LIKE LASAGNA?",
  HINT: "Duck dinner preferences unknown.",

  words: ["LASAGNA", "DUCKS", "THINK", "LIKE", "YOU"],

  paths: {
    LASAGNA: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    DUCKS: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    THINK: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    LIKE: [[9,0],[9,1],[9,2],[9,3]],
    YOU: [[7,5],[7,6],[7,7]]
  }
},

{
  phrase: "I AM SEARCHING FOR THE PERFECT LASAGNA RECIPE.",
  HINT: "Carb investigation underway.",

  words: ["SEARCHING", "LASAGNA", "PERFECT", "RECIPE"],

  paths: {
    SEARCHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    LASAGNA: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],
    PERFECT: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]],
    RECIPE: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]]
  }
},

{
  phrase: "CAN YOU CHECK IF WE HAVE ANY MOZZARELLA LEFT?",
  HINT: "Cheese inventory critical.",

  words: ["MOZZARELLA", "CHECK", "HAVE", "LEFT", "YOU", "CAN"],

  paths: {
    MOZZARELLA: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    CHECK: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    HAVE: [[0,6],[1,6],[2,6],[3,6]],
    LEFT: [[9,3],[9,4],[9,5],[9,6]],
    YOU: [[5,5],[5,6],[5,7]],
    CAN: [[7,2],[7,3],[7,4]]
  }
},

{
  phrase: "THAT DUCK HAS NOT RESPONDED TO MY LASAGNA DINNER INVITE.",
  HINT: "Duck RSVP still pending.",

  words: ["RESPONDED", "LASAGNA", "DINNER", "INVITE", "DUCK", "THAT"],

  paths: {
    RESPONDED: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    LASAGNA: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],
    DINNER: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    INVITE: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6]],
    DUCK: [[7,3],[7,4],[7,5],[7,6]],
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
  phrase: "I ADDED CREATINE TO THE SHOPPING CART, I'M ABOUT TO GET YOKED.",
  HINT: "Gains protocol initiated.",

  words: ["CREATINE", "SHOPPING", "YOKED", "CART", "GET", "ADDED"],

  paths: {
    CREATINE: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    SHOPPING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    YOKED: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    CART: [[3,1],[4,1],[5,1],[6,1]],
    GET: [[0,0],[0,1],[0,2]],
    ADDED: [[9,1],[9,2],[9,3],[9,4],[9,5]]
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
  phrase: "IF YOU ARE SCARED OF ESCALATORS, THERE ARE STEPS YOU CAN TAKE.",
  HINT: "Stair-based solution available.",

  words: ["ESCALATORS", "SCARED", "STEPS", "TAKE", "YOU", "ARE"],

  paths: {
    ESCALATORS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    SCARED: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    STEPS: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    TAKE: [[3,2],[4,2],[5,2],[6,2]],
    YOU: [[4,6],[5,6],[6,6]],
    ARE: [[8,7],[9,7],[10,7]]
  }
},

{
  phrase: "I WOULD AGREE WITH YOU, BUT THEN WE WOULD BOTH BE WRONG.",
  HINT: "Consensus failure detected.",

  words: ["AGREE", "WRONG", "WOULD", "BOTH", "YOU", "THEN", "BUT"],

  paths: {
    AGREE: [[0,1],[1,1],[2,1],[3,1],[4,1]],
    WRONG: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    WOULD: [[0,7],[1,7],[2,7],[3,7],[4,7]],
    BOTH: [[7,2],[7,3],[7,4],[7,5]],
    YOU: [[8,7],[9,7],[10,7]],
    THEN: [[6,0],[7,0],[8,0],[9,0]],
    BUT: [[9,2],[9,3],[9,4]]
  }
},


{
  phrase: "THE ROTATION OF THE EARTH REALLY MAKES MY DAY.",
  HINT: "Planetary dad joke detected.",

  words: ["ROTATION", "EARTH", "REALLY", "MAKES", "DAY", "THE"],

  paths: {
    ROTATION: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    EARTH: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    REALLY: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    MAKES: [[9,1],[9,2],[9,3],[9,4],[9,5]],
    DAY: [[0,5],[0,6],[0,7]],
    THE: [[7,3],[7,4],[7,5]]
  }
},

{
  phrase: "YOUR PRINTER AND I ARE NOT ON THE SAME PAGE.",
  HINT: "Printer relationship status unclear.",

  words: ["PRINTER", "PAGE", "SAME", "YOUR", "NOT", "THE"],

  paths: {
    PRINTER: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    PAGE: [[9,0],[9,1],[9,2],[9,3]],
    SAME: [[2,4],[3,4],[4,4],[5,4]],
    YOUR: [[7,3],[7,4],[7,5],[7,6]],
    NOT: [[0,6],[1,6],[2,6]],
    THE: [[10,5],[10,6],[10,7]]
  }
},

{
  phrase: "I BROKE UP WITH YOUR CALCULATOR, IT KEPT COUNTING MY MISTAKES.",
  HINT: "Emotional math error detected.",

  words: ["CALCULATOR", "COUNTING", "MISTAKES", "BROKE", "YOUR"],

  paths: {
    CALCULATOR: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],
    COUNTING: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],
    MISTAKES: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
    BROKE: [[9,2],[9,3],[9,4],[9,5],[9,6]],
    YOUR: [[8,3],[8,4],[8,5],[8,6]]
  }
},




{
  phrase: "THE SUNSET LOOP REPEATS EVERY TWENTY-FOUR HOURS.",

  HINT: "Daylight cycle anomaly detected.",

  words: [
    "SUNSET",
    "REPEATS",
    "HOURS",
    "EVERY",
    "LOOP",
    "THE",
    "TWENTYFOUR"
  ],

  paths: {

    SUNSET: [
      [0,2],[0,3],[0,4],[0,5],[0,6],[0,7]
    ],

    REPEATS: [
      [2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]
    ],

    HOURS: [
      [4,7],[5,7],[6,7],[7,7],[8,7]
    ],

    EVERY: [
      [6,2],[6,3],[6,4],[6,5],[6,6]
    ],

    LOOP: [
      [8,1],[8,2],[8,3],[8,4]
    ],

    THE: [
      [10,3],[10,4],[10,5]
    ],

    TWENTYFOUR: [
      [0,0],
      [1,0],
      [2,0],
      [3,0],
      [4,0],
      [5,0],
      [6,0],
      [7,0],
      [8,0],
      [9,0]
    ]
  }
},


{
  phrase: "THE TOASTER KNOWS YOUR NAME...",

  HINT: "Breakfast machine acting strange.",

  words: [
    "KNOWS",
    "YOUR",
    "NAME",
    "THE",
    "TOASTER"
  ],

  paths: {

    YOUR: [
      [1,1],[1,2],[1,3],[1,4]
    ],

    THE: [
      [3,5],[3,6],[3,7]
    ],

    KNOWS: [
      [5,0],[5,1],[5,2],[5,3],[5,4]
    ],

    NAME: [
      [7,7],[8,7],[9,7],[10,7]
    ],

    TOASTER: [
      [9,0],[9,1],[9,2],[9,3],
      [9,4],[9,5],[9,6]
    ]
  }
},


{
  phrase: "YOUR BROWSER HAS TOO MANY TABS.",

  HINT: "Chaotic internet activity detected.",

  words: [
    "TABS",
    "BROWSER",
    "TOO",
    "YOUR",
    "MANY"
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
    ]
  }
},


{
  phrase: "THE WIFI HAS QUESTIONS ABOUT THE FOOD PYRAMID.",

  HINT: "Unusual internet behavior detected.",

  words: [
    "CONCERNED",
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
    "NOT"
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
    ]
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
  phrase: "THE SUNSET LOOPED AGAIN TODAY.",

  HINT: "Sky cycle repeated suspiciously.",

  words: [
    "SUNSET",
    "LOOPED",
    "AGAIN",
    "TODAY",
    "THE"
  ],

  paths: {

    SUNSET: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    LOOPED: [
      [2,0],[2,1],[2,2],[2,3],[2,4],[2,5]
    ],

    AGAIN: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    TODAY: [
      [6,0],[6,1],[6,2],[6,3],[6,4]
    ],

    THE: [
      [5,10],[6,10],[7,10]
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
  phrase: "THE MOON LOOKS RENDERED TONIGHT.",

  HINT: "Suspicious sky graphics detected.",

  words: [
    "RENDERED",
    "TONIGHT",
    "LOOKS",
    "MOON",
    "THE"
  ],

  paths: {

    RENDERED: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6],[0,7]
    ],

    TONIGHT: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6]
    ],

    LOOKS: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    MOON: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    THE: [
      [5,7],[6,7],[7,7]
    ]
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
      [6,5],[7,5],[8,5]
    ]
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
  phrase: "HOLD MY HAND I AM SCARED!",

  HINT: "Emotional support requested.",

  words: [
    "HOLD",
    "HAND",
    "SCARED"
  ],

  paths: {

    HOLD: [
      [0,0],[0,1],[0,2],[0,3]
    ],

    HAND: [
      [2,0],[2,1],[2,2],[2,3]
    ],

    SCARED: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5]
    ]
  }
},

{
  phrase: "I SIGNED US UP FOR BALLROOM DANCING.",

  HINT: "Unexpected dance commitment detected.",

  words: [
    "SIGNED",
    "BALLROOM",
    "DANCING",
    "FOR"
  ],

  paths: {

    SIGNED: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    BALLROOM: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6],[2,7]
    ],

    DANCING: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]
    ],

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
  phrase: "WOW, YOU MADE IT WORSE FASTER.",
  HINT: "Improvement not detected.",

  words: ["WOW", "YOU", "MADE", "WORSE", "FASTER"],

  paths: {
    WOW: [[0,0],[0,1],[0,2]],
    YOU: [[0,4],[0,5],[0,6]],
    MADE: [[2,0],[2,1],[2,2],[2,3]],
    
    WORSE: [[6,7],[7,7],[8,7],[9,7],[10,7]],
    FASTER: [[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]]
  }
},

{
  phrase: "OH COOL, ANOTHER TERRIBLE IDEA.",
  HINT: "Decision quality declining.",

  words: [ "COOL", "ANOTHER", "TERRIBLE", "IDEA"],

  paths: {
    
    COOL: [[2,0],[2,1],[2,2],[2,3]],
    ANOTHER: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]],
    TERRIBLE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]],
    IDEA: [[7,0],[7,1],[7,2],[7,3]]
  }
},

{
  phrase: "THAT FIX CREATED THREE NEW PROBLEMS!",
  HINT: "Repair attempt became folklore.",

  words: ["THAT", "FIX", "CREATED", "THREE", "NEW", "PROBLEMS"],

  paths: {
    THAT: [[0,0],[0,1],[0,2],[0,3]],
    FIX: [[2,0],[2,1],[2,2]],
    CREATED: [[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]],
    THREE: [[6,0],[6,1],[6,2],[6,3],[6,4]],
    NEW: [[8,0],[9,0],[10,0]],
    PROBLEMS: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]
  }
},

{
  phrase: "I CAN SMELL THE BAD DECISION.",
  HINT: "Regret detected nearby.",

  words: ["CAN", "SMELL", "BAD", "DECISION"],

  paths: {
    
    CAN: [[8,7],[9,7],[10,7]],
    SMELL: [[2,0],[2,1],[2,2],[2,3],[2,4]],
    
    BAD: [[6,0],[6,1],[6,2]],
    DECISION: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]
  }
}, 



{
  phrase: "NICE CLICK BOZO, NOW WE ARE CURSED!",
  HINT: "Supernatural consequences unlocked.",

  words: ["NICE", "CLICK", "BOZO", "NOW", "WE", "ARE", "CURSED"],

  paths: {
    NICE: [[0,0],[0,1],[0,2],[0,3]],

    CLICK: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    BOZO: [
      [0,6],[1,6],[2,6],[3,6]
    ],

    NOW: [
      [5,1],[5,2],[5,3]
    ],

    WE: [
      [9,0],[10,0]
    ],

    ARE: [
      [3,7],[4,7],[5,7]
    ],

    CURSED: [
      [7,2],[7,3],[7,4],
      [7,5],[7,6],[7,7]
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
  phrase: "EVEN THE LOADING SCREEN GAVE UP.",
  HINT: "Patience bar depleted.",

  words: ["EVEN", "LOADING", "SCREEN", "GAVE"],

  paths: {
    EVEN: [[0,0],[0,1],[0,2],[0,3]],
    
    LOADING: [[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3]],
    SCREEN: [[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]],
    GAVE: [[0,7],[1,7],[2,7],[3,7]]
   
  }
},



{
  phrase: "THE SYSTEM REQUESTS A DIFFERENT USER.",
  HINT: "Replacement human recommended.",

  words: ["THE", "SYSTEM", "REQUESTS", "DIFFERENT", "USER"],

  paths: {
    THE: [[0,0],[0,1],[0,2]],
    SYSTEM: [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    REQUESTS: [[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
  
    DIFFERENT: [[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]],
    USER: [[5,5],[6,5],[7,5],[8,5]]
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
    SOUND: [[0,0],[1,0],[2,0],[3,0],[4,0]],
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
  phrase: "THE MAINFRAME IS ASKING WEIRD QUESTIONS...",
  HINT: "Old computer got curious.",
  words: ["MAINFRAME", "QUESTIONS", "ASKING", "WEIRD", "THE"],
  paths: {
    MAINFRAME: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    QUESTIONS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    ASKING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    WEIRD: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    THE: [[9,0],[9,1],[9,2]]
    
  }
},

{
  phrase: "SYSTEM CONFUSION REACHING CRITICAL LEVELS.",
  HINT: "Thinking machine is cooked.",
  words: ["CONFUSION", "REACHING", "CRITICAL", "SYSTEM", "LEVELS"],
  paths: {
    CONFUSION: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    REACHING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    CRITICAL: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    LEVELS: [[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]],
    SYSTEM: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]]
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
  phrase: "YOU LOOK LIKE YOU SAY \"TRUST ME\" TOO MUCH.",
  HINT: "Confidence level suspicious.",
  words: ["TRUST", "MUCH", "LOOK", "SAY", "YOU", "LIKE"],
  paths: {
    TRUST: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    MUCH: [[0,2],[1,2],[2,2],[3,2]],
    LOOK: [[0,4],[1,4],[2,4],[3,4]],
    SAY: [[0,6],[1,6],[2,6]],
    YOU: [[7,5],[7,6],[7,7]],
    LIKE: [[9,3], [9,4], [9,5], [9,6]]
  }
},

{
  phrase: "YOUR COMPUTER IS AFRAID TO UPDATE.",
  HINT: "Update anxiety detected.",
  words: ["COMPUTER", "AFRAID", "UPDATE", "YOUR"],
  paths: {
    COMPUTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    AFRAID: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    UPDATE: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    YOUR: [[7,4],[7,5],[7,6],[7,7]],
    
  }
},

{
  phrase: "STOP YELLING AT THE CAPTCHA!",
  HINT: "Robot verification failed.",

  words: ["STOP", "YELLING", "CAPTCHA", "THE", "AT"],

  paths: {

    CAPTCHA: [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]
    ],

    YELLING: [
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]
    ],

    STOP: [
      [0,4],[1,4],[2,4],[3,4]
    ],

    THE: [
      [0,6],[1,6],[2,6]
    ],

    AT: [
      [5,6],[6,6]
    ]

  }
},

{
  phrase: "HOW ABOUT YOU CLOSE THOSE 47 TABS?",
  HINT: "Browser stability questionable.",

  words: ["ABOUT", "CLOSE", "THOSE", "TABS", "YOU", "HOW"],

  paths: {
    ABOUT: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    CLOSE: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    THOSE: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    TABS: [[0,6],[1,6],[2,6],[3,6]],
    YOU: [[7,5],[7,6],[7,7]],
    HOW: [[6,0], [6,1], [6,2]]
  }
},

{
  phrase: "I BET YOU COLLECT OLD WIRES.",
  HINT: "Cable hoarding suspected.",
  words: ["COLLECT", "WIRES", "OLD", "BET", "YOU"],
  paths: {
    COLLECT: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    WIRES: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    OLD: [[0,4],[1,4],[2,4]],
    BET: [[0,6],[1,6],[2,6]],
    YOU: [[7,5],[7,6],[7,7]]
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
  phrase: "DID YOU JUST SAY OOPS BEFORE YOU FELL?",
  HINT: "Gravity event confirmed.",

  words: ["BEFORE","OOPS","FELL","JUST","YOU"],

  paths: {
    BEFORE: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    OOPS: [[0,3],[1,3],[2,3],[3,3]],
    FELL: [[5,3],[6,3],[7,3],[8,3]],
    JUST: [[10,0],[10,1],[10,2],[10,3]],
    YOU: [[3,5],[3,6],[3,7]]
  }
},
{
  phrase: "PLEASE, TELL THE VACUUM I SAID HOWDY.",
  HINT: "Appliance diplomacy initiated.",

  words: ["VACUUM","HOWDY","TELL","SAID", "THE"],

  paths: {
    VACUUM: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    HOWDY: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    TELL: [[0,4],[1,4],[2,4],[3,4]],
    SAID: [[0,6],[1,6],[2,6],[3,6]],
    THE: [[6, 4], [6,5], [6,6]]
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
  phrase: "I GUESS THE STORE WAS OUT OF DEODORANT AGAIN...",
  HINT: "Personal atmosphere unstable.",

  words: ["STORE", "AGAIN", "GUESS", "OUT", "THE", "DEODORANT"],

  paths: {
    STORE: [[0,0],[1,0],[2,0],[3,0],[4,0]],
    AGAIN: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    GUESS: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    OUT: [[0,6],[1,6],[2,6]],
    THE: [[0,7],[1,7],[2,7]],
    DEODORANT: [[1,5], [2,5], [3,5], [4,5], [5,5], [6,5],[7,5], [8,5], [9,5]]
  }
},

{
  phrase: "I AM NOT GOING TO TELL YOU AGAIN, STOP SPILLING REDBULL ON ME!",
  HINT: "Keyboard beverage threat detected.",

  words: ["SPILLING", "REDBULL", "AGAIN", "TELL", "STOP", "NOT", "GOING"],

  paths: {
    SPILLING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    REDBULL: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    AGAIN: [[0,4],[1,4],[2,4],[3,4],[4,4]],
    TELL: [[8,2],[8,3],[8,4],[8,5]],
    STOP: [[7,7],[8,7],[9,7],[10,7]],
    NOT: [[2,7], [3,7], [4,7]],
    GOING: [[10,0], [10,1], [10,2], [10,3], [10,4]]
  }
},

{
  phrase: "YOU LOOK LIKE YOU WOULD BE STICKY IF I TOUCHED YOU.",
  HINT: "Surface contamination suspected.",

  words: ["TOUCHED","STICKY","LOOK","LIKE","YOU", "WOULD"],

  paths: {
    TOUCHED: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    STICKY: [[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    LOOK: [[10,0],[10,1],[10,2],[10,3]],
    LIKE: [[0,5],[1,5],[2,5],[3,5]],
    YOU: [[10,5],[10,6],[10,7]],
    WOULD: [[4,6], [5,6], [6,6], [7,6], [8,6]]
  }
},

{
  phrase: "BACK TO THE SAME YOU TUBE CHANNEL AGAIN HUH?",
  HINT: "Phone has detected a rerun.",
  words: ["BACK", "TO", "THE", "SAME", "YOU", "TUBE", "CHANNEL", "AGAIN"],
  paths: {
    BACK: [[0,0],[0,1],[0,2],[0,3]],
    TO: [[0,5],[0,6]],
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
  phrase: "EXPLAIN CRYPTO TO ME AGAIN.",
  HINT: "Phone financial confusion detected.",
  words: ["EXPLAIN", "CRYPTO", "AGAIN"],
  paths: {
    EXPLAIN: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    CRYPTO: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],
    
    AGAIN: [[6,0],[6,1],[6,2],[6,3],[6,4]]
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
  HINT: "HINT: emoji excess confirmed.",
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
  HINT: "HINT: app loneliness spiral detected.",
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
  HINT: "HINT: battery judgment activated.",
  words: ["WHY", "YOU", "THINK", "TWENTY", "PERCENT", "BATTERY", "GOOD", "ENOUGH"],
  paths: {
    WHY: [[0,0],[0,1],[0,2]],
    YOU: [[2,0],[3,0],[4,0]],

    THINK: [[2,2],[3,2],[4,2],[5,2],[6,2]],
    TWENTY: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]],
    PERCENT: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    BATTERY: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    GOOD: [[8,0],[8,1],[8,2],[8,3]],
    ENOUGH: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]]
  }
},

{
  phrase: "TAKE ME TO THE RESTROOM, THAT LAST UPDATE MESSED ME UP.",
  HINT: "HINT: update digestion failed.",
  words: ["TAKE", "THE", "RESTROOM", "THAT", "LAST", "UPDATE", "MESSED"],
  paths: {
    TAKE: [[0,0],[0,1],[0,2],[0,3]],
   
    THE: [[2,2],[3,2],[4,2]],
    RESTROOM: [[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]],
    THAT: [[2,0],[3,0],[4,0],[5,0]],
    LAST: [[1,5],[2,5],[3,5],[4,5]],
    UPDATE: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5]],
    MESSED: [[9,0],[9,1],[9,2],[9,3],[9,4],[9,5]],
   
  }
},

{
  phrase: "THE ROUTER READ YOUR DISCORD CHAT AGAIN...",
  HINT: "HINT: router gossip detected.",
  words: ["THE", "ROUTER", "READ", "YOUR", "DISCORD", "CHAT", "AGAIN"],
  paths: {
    THE: [[0,0],[0,1],[0,2]],

    ROUTER: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    DISCORD: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    READ: [[7,0],[7,1],[7,2],[7,3]],
    YOUR: [[2,0],[3,0],[4,0],[5,0]],
    CHAT: [[7,6],[8,6],[9,6],[10,6]],
    AGAIN: [[10,0],[10,1],[10,2],[10,3],[10,4]]
  }
},

{
  phrase: "OH, SO IT IS CEREAL THEN MILK GOT IT.",
  HINT: "HINT: breakfast order recorded.",
  words: ["CEREAL", "THEN", "MILK", "GOT"],
  paths: {
   
    CEREAL: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]],
    THEN: [[6,0],[6,1],[6,2],[6,3]],
    MILK: [[8,0],[8,1],[8,2],[8,3]],
    GOT: [[10,0],[10,1],[10,2]]
  }
},

{
  phrase: "SO I PUT UP AN ADD FOR A FREE CAT, YOU CAN PROBABLY JUST PUT HIM OUTSIDE NOW.",
  HINT: "HINT: cat relocation plan detected.",
  words: ["PUT", "ADD", "FOR", "FREE", "CAT", "YOU", "CAN", "PROBABLY", "JUST", "HIM", "OUTSIDE", "NOW"],
  paths: {
    PROBABLY: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    OUTSIDE: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],

    PUT: [[0,2],[0,3],[0,4]],
    ADD: [[2,2],[2,3],[2,4]],
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
  HINT: "HINT: kitchen landscaping proposed.",
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
  phrase: "WHILE I TRUST GARFIELD ON LASAGNA, HE IS SO WRONG ABOUT MONDAYS, THEY ARE THE BEST!",
  HINT: "Monday opinion from a 90's cartoon cat detected.",
  words: ["WHILE", "TRUST", "GARFIELD", "LASAGNA", "WRONG", "ABOUT", "MONDAYS", "THEY", "ARE", "BEST"],
  paths: {
    GARFIELD: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6]],
    LASAGNA: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
    MONDAYS: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]],

    WHILE: [[0,2],[0,3],[0,4],[0,5],[0,6]],
    TRUST: [[0,1],[1,1],[2,1],[3,1],[4,1]],
    WRONG: [[6,3],[7,3],[8,3],[9,3],[10,3]],
    ABOUT: [[0,0],[1,0],[2,0],[3,0],[4,0]],

    THEY: [[7,1],[8,1],[9,1],[10,1]],
    BEST: [[2,2],[3,2],[4,2],[5,2]],
    ARE: [[8,4],[9,4],[10,4]]
    
  }
}








];


function startGame() {
  document.getElementById("startScreen").style.display = "none";
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

  responseOutput.innerHTML = '<span class="waitingCursor">...</span>';

  document.getElementById("wordCount").textContent =
    currentPuzzle.words.length;

  document.getElementById("signalHint").textContent =
    currentPuzzle.HINT;

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



function playSignalSound() {
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

    document.getElementById("scoreDisplay").textContent =
      totalScore;

    const flash = document.getElementById("pointsFlash");

    flash.textContent = "+" + pointsEarned;
    flash.style.opacity = "1";

    setTimeout(() => {
      flash.style.opacity = "0";
    }, 1500);

    playSignalSound();
    typeSystemResponse(currentPuzzle.phrase);
  }
}


function typeSystemResponse(text) {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }

  responseOutput.textContent = "";

  let i = 0;

  typingInterval = setInterval(() => {
    responseOutput.textContent += text[i];
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

// wait for START button


