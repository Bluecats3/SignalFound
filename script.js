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
  phrase: "THE ROTATION OF THE EARTH REALLY MAKES MY DAY",
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
  phrase: "YOUR PRINTER AND I ARE NOT ON THE SAME PAGE",
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
  phrase: "I BROKE UP WITH YOUR CALCULATOR IT KEPT COUNTING MY MISTAKES",
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
  phrase: "THE TIMELINE IS HELD WITH GLUE.",

  HINT: "Reality repair detected.",

  words: [
    "TIMELINE",
    "HELD",
    "WITH",
    "GLUE",
    "THE",
    "IS"
  ],

  paths: {

    TIMELINE: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6],[0,7]
    ],

    HELD: [
      [2,0],[2,1],[2,2],[2,3]
    ],

    WITH: [
      [4,4],[4,5],[4,6],[4,7]
    ],

    GLUE: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    THE: [
      [8,0],[8,1],[8,2]
    ],

    IS: [
      [9,6],[9,7]
    ]
  }
},

{
  phrase: "THE MAINFRAME FEARS CUSTOMER SERVICE.",

  HINT: "Support ticket anxiety detected.",

  words: [
    "MAINFRAME",
    "CUSTOMER",
    "SERVICE",
    "FEARS",
    "THE"
  ],

  paths: {

    MAINFRAME: [
      [0,0],
      [1,0],
      [2,0],
      [3,0],
      [4,0],
      [5,0],
      [6,0],
      [7,0],
      [8,0]
    ],

    CUSTOMER: [
      [0,2],
      [1,2],
      [2,2],
      [3,2],
      [4,2],
      [5,2],
      [6,2],
      [7,2]
    ],

    SERVICE: [
      [1,4],
      [2,4],
      [3,4],
      [4,4],
      [5,4],
      [6,4],
      [7,4]
    ],

    FEARS: [
      [9,0],[9,1],[9,2],[9,3],[9,4]
    ],

    THE: [
      [0,5],[0,6],[0,7]
    ]
  }
},

{
  phrase: "REALITY HAS TOO MANY POPUPS.",

  HINT: "Browser dimension overload detected.",

  words: [
    "REALITY",
    "POPUPS",
    "MANY",
    "TOO",
    "HAS"
  ],

  paths: {

    REALITY: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6]
    ],

    POPUPS: [
      [2,2],[2,3],[2,4],[2,5],[2,6],[2,7]
    ],

    MANY: [
      [4,0],[4,1],[4,2],[4,3]
    ],

    TOO: [
      [6,5],[6,6],[6,7]
    ],

    HAS: [
      [8,0],[8,1],[8,2]
    ]
  }
},




{
  phrase: "THE MAINFRAME KNOWS YOU USED AI.",

  HINT: "Homework authenticity warning detected.",

  words: [
    "KNOWS",
    "USED",
    "MAINFRAME",
    "YOU",
    "AI"
  ],

  paths: {

    MAINFRAME: [
      [1,0],
      [2,0],
      [3,0],
      [4,0],
      [5,0],
      [6,0],
      [7,0],
      [8,0],
      [9,0]
    ],

    KNOWS: [
      [1,2],[1,3],[1,4],[1,5],[1,6]
    ],

    USED: [
      [3,3],[3,4],[3,5],[3,6]
    ],

    YOU: [
      [5,4],[5,5],[5,6]
    ],

    AI: [
      [7,6],[7,7]
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
  phrase: "THE WIFI IS CONCERNED.",

  HINT: "Unusual internet behavior detected.",

  words: [
    "CONCERNED",
    "WIFI",
    "IS",
    "THE"
  ],

  paths: {

    WIFI: [
      [1,4],[1,5],[1,6],[1,7]
    ],

    IS: [
      [3,6],[3,7]
    ],

    THE: [
      [5,5],[5,6],[5,7]
    ],

    CONCERNED: [
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
  phrase: "SERVER NEEDS AN ENERGY DRINK.",

  HINT: "HINT: exhausted machine noises detected.",

  words: [
    "DRINK",
    "SERVER",
    "NEEDS",
    "THE",
    "ENERGY"
  ],

  paths: {

    DRINK: [
      [1,3],[1,4],[1,5],[1,6],[1,7]
    ],

    NEEDS: [
      [3,3],[3,4],[3,5],[3,6],[3,7]
    ],

    THE: [
      [5,5],[5,6],[5,7]
    ],

    ENERGY: [
      [7,2],[7,3],[7,4],[7,5],[7,6],[7,7]
    ],

    SERVER: [
      [10,2],[10,3],[10,4],
      [10,5],[10,6],[10,7]
    ]
  }
},




{
  phrase: "MACHINE KNOWS YOU SKIPPED LEG DAY.",

  HINT: "HINT: weakness analysis complete.",

  words: [
    "LEGDAY",
    "SKIPPED",
    "KNOWS",
    "YOU",
    "THE",
    "MACHINE"
  ],

  paths: {

    MACHINE: [
      [1,0],
      [2,0],
      [3,0],
      [4,0],
      [5,0],
      [6,0],
      [7,0]
    ],

    YOU: [
      [1,5],[1,6],[1,7]
    ],

    THE: [
      [3,5],[3,6],[3,7]
    ],

    KNOWS: [
      [5,3],[5,4],[5,5],[5,6],[5,7]
    ],

    SKIPPED: [
      [7,1],[7,2],[7,3],
      [7,4],[7,5],[7,6],[7,7]
    ],

    LEGDAY: [
      [10,2],[10,3],[10,4],
      [10,5],[10,6],[10,7]
    ]
  }
},



{
  phrase: "THE SERVER FOUND YOUR OLD MEMES!",

  HINT: "Ancient internet evidence recovered.",

  words: [
    "MEMES",
    "SERVER",
    "FOUND",
    "YOUR",
    "THE"
  ],

  paths: {
    MEMES: [
      [1,3],[1,4],[1,5],[1,6],[1,7]
    ],

    FOUND: [
      [3,3],[3,4],[3,5],[3,6],[3,7]
    ],

    YOUR: [
      [5,4],[5,5],[5,6],[5,7]
    ],

    THE: [
      [7,5],[7,6],[7,7]
    ],

    SERVER: [
      [10,2],[10,3],[10,4],[10,5],[10,6],[10,7]
    ]
  }
},

{
  phrase: "THE LAPTOP HEARD YOUR EXCUSE.",

  HINT: "Homework delay reason recorded.",

  words: [
    "EXCUSE",
    "HEARD",
    "LAPTOP",
    "YOUR",
    "THE"
  ],

  paths: {
    HEARD: [
      [1,3],[1,4],[1,5],[1,6],[1,7]
    ],

    YOUR: [
      [3,4],[3,5],[3,6],[3,7]
    ],

    THE: [
      [5,5],[5,6],[5,7]
    ],

    EXCUSE: [
      [7,2],[7,3],[7,4],[7,5],[7,6],[7,7]
    ],

    LAPTOP: [
      [10,2],[10,3],[10,4],[10,5],[10,6],[10,7]
    ]
  }
},









{
  phrase: "THE MAINFRAME SAID FEED THE DOG.",

  HINT: "Pet care reminder transmitted.",

  words: [
    "DOG",
    "FEED",
    "SAID",
    "THE",
    "MAINFRAME"
  ],

  paths: {

    DOG: [
      [1,5],[1,6],[1,7]
    ],

    FEED: [
      [3,4],[3,5],[3,6],[3,7]
    ],

    THE: [
      [5,5],[5,6],[5,7]
    ],

    SAID: [
      [7,4],[7,5],[7,6],[7,7]
    ],

    MAINFRAME: [
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
  phrase: "YOUR WIFI KNOWS YOU IGNORED MOM.",

  HINT: "Parental disrespect detected.",

  words: [
    "MOM",
    "WIFI",
    "KNOWS",
    "YOUR",
    "IGNORED"
  ],

  paths: {

    MOM: [
      [1,5],[1,6],[1,7]
    ],

    YOUR: [
      [3,4],[3,5],[3,6],[3,7]
    ],

    WIFI: [
      [5,4],[5,5],[5,6],[5,7]
    ],

    KNOWS: [
      [7,3],[7,4],[7,5],[7,6],[7,7]
    ],

    IGNORED: [
      [10,1],[10,2],[10,3],
      [10,4],[10,5],[10,6],[10,7]
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
    "IS"
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

    IS: [
      [9,5],[9,6]
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
  phrase: "THE UNIVERSE RUNS ON DUCT TAPE.",

  HINT: "Cosmic repair job detected.",

  words: [
    "UNIVERSE",
    "DUCT",
    "TAPE",
    "RUNS",
    "THIS",
    
  ],

  paths: {

    UNIVERSE: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6],[0,7]
    ],

    DUCT: [
      [2,0],[2,1],[2,2],[2,3]
    ],

    TAPE: [
      [4,0],[4,1],[4,2],[4,3]
    ],

    RUNS: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    THIS: [
      [3,7],[4,7],[5,7],[6,7]]
    

   
  }
},

{
  phrase: "THE SERVERS DREAM IN PIXELS.",

  HINT: "Machine sleep pattern detected.",

  words: [
    "SERVERS",
    "PIXELS",
    "DREAM",
    "THE",
    "IN"
  ],

  paths: {

    SERVERS: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6]
    ],

    PIXELS: [
      [2,0],[2,1],[2,2],[2,3],[2,4],[2,5]
    ],

    DREAM: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    THE: [
      [6,2],[7,2],[8,2]
    ],

    IN: [
      [6,7],[7,7]
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
  phrase: "YOUR CHARGER HAS SEPARATION ANXIETY.",

  HINT: "Power cord emotional distress detected.",

  words: [
    "SEPARATION",
    "CHARGER",
    "ANXIETY",
    "YOUR",
    "HAS"
  ],

  paths: {

    SEPARATION: [
      [0,0],[1,0],[2,0],[3,0],[4,0],
      [5,0],[6,0],[7,0],[8,0],[9,0]
    ],

    CHARGER: [
      [2,1],[2,2],[2,3],[2,4],
      [2,5],[2,6],[2,7]
    ],

    ANXIETY: [
      [4,1],[4,2],[4,3],[4,4],
      [4,5],[4,6],[4,7]
    ],

    YOUR: [
      [7,6],[8,6],[9,6],[10,6]
    ],

    HAS: [
      [8,7],[9,7],[10,7]
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
  phrase: "THE SYSTEM DETECTED EMOTIONAL DAMAGE.",

  HINT: "Feelings scan returned unstable.",

  words: [
    "EMOTIONAL",
    "DETECTED",
    "DAMAGE",
    "SYSTEM",
    "THE"
  ],

  paths: {

    EMOTIONAL: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6],[0,7],[0,8]
    ],

    DETECTED: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6],[2,7]
    ],

    DAMAGE: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5]
    ],

    SYSTEM: [
      [6,0],[6,1],[6,2],[6,3],[6,4],[6,5]
    ],

    THE: [
      [5,10],[6,10],[7,10]
    ]
  }
},



{
  phrase: "THIS DIMENSION FEELS UNDERFUNDED.",

  HINT: "Budget reality collapse detected.",

  words: [
    "UNDERFUNDED",
    "DIMENSION",
    "FEELS",
    "THIS"
  ],

  paths: {

    UNDERFUNDED: [
      [0,6],[1,6],[2,6],[3,6],[4,6],
      [5,6],[6,6],[7,6],[8,6],[9,6],[10,6]
    ],

    DIMENSION: [
      [2,7],[3,7],[4,7],[5,7],
      [6,7],[7,7],[8,7],[9,7],[10,7]
    ],

    FEELS: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    THIS: [
      [6,0],[6,1],[6,2],[6,3]
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
  phrase: "SHOULD I BUY A MOTORCYCLE",
  HINT: "Midlife crisis loading.",

  words: ["MOTORCYCLE", "SHOULD", "BUY"],

  paths: {
    SHOULD: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
    MOTORCYCLE: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    
    BUY: [[3,5],[3,6],[3,7]]
  }
},








{
  phrase: "THE WIFI FEARS ABANDONMENT.",

  HINT: "Router emotional instability detected.",

  words: [
    "ABANDONMENT",
    "FEARS",
    "WIFI",
    "THE"
  ],

  paths: {

    ABANDONMENT: [
      [0,6],[1,6],[2,6],[3,6],[4,6],
      [5,6],[6,6],[7,6],[8,6],[9,6],[10,6]
    ],

    FEARS: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    WIFI: [
      [4,0],[4,1],[4,2],[4,3]
    ],

    THE: [
      [5,7],[6,7],[7,7]
    ]
  }
},

{
  phrase: "REALITY BUFFERING, PLEASE WAIT.",

  HINT: "Existence loading slowly.",

  words: [
    "BUFFERING",
    "REALITY",
    "PLEASE",
    "WAIT"
  ],

  paths: {

    BUFFERING: [
      [0,7],[1,7],[2,7],[3,7],[4,7],
      [5,7],[6,7],[7,7],[8,7]
    ],

    REALITY: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6]
    ],

    PLEASE: [
      [4,0],[4,1],[4,2],[4,3],[4,4],[4,5]
    ],

    WAIT: [
      [6,4],[7,4],[8,4],[9,4]
    ]
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
  phrase: "THE SERVERS DETECTED SADNESS.",

  HINT: "Emotional data leak detected.",

  words: [
    "DETECTED",
    "SERVERS",
    "SADNESS",
    "THE"
  ],

  paths: {

    DETECTED: [
      [0,0],[0,1],[0,2],[0,3],
      [0,4],[0,5],[0,6],[0,7]
    ],

    SERVERS: [
      [2,0],[2,1],[2,2],[2,3],
      [2,4],[2,5],[2,6]
    ],

    SADNESS: [
      [4,0],[4,1],[4,2],[4,3],
      [4,4],[4,5],[4,6]
    ],

    THE: [
      [5,7],[6,7],[7,7]
    ]
  }
},

{
  phrase: "THE CLOUDS FAILED TO LOAD TODAY.",

  HINT: "Sky rendering error detected.",

  words: [
    "CLOUDS",
    "FAILED",
    "TODAY",
    "LOAD",
    "THE",
    "TO"
  ],

  paths: {

    CLOUDS: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    FAILED: [
      [2,0],[2,1],[2,2],[2,3],[2,4],[2,5]
    ],

    TODAY: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    LOAD: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    THE: [
      [5,7],[6,7],[7,7]
    ],

    TO: [
      [0,7],[1,7]
    ]
  }
},

{
  phrase: "HUMAN BRAINS RUN ON PANIC MODE.",

  HINT: "Nervous system overclocked.",

  words: [
    "HUMAN",
    "BRAINS",
    "PANIC",
    "MODE",
    "RUN",
    "ON"
  ],

  paths: {

    BRAINS: [
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5]
    ],

    HUMAN: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    PANIC: [
      [4,0],[4,1],[4,2],[4,3],[4,4]
    ],

    MODE: [
      [6,0],[6,1],[6,2],[6,3]
    ],

    RUN: [
      [5,5],[6,5],[7,5]
    ],

    ON: [
      [6,7],[7,7]
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
  phrase: "THE ALGORITHM WANTS A HUG.",

  HINT: "Code loneliness detected.",

  words: [
    "ALGORITHM",
    "WANTS",
    "HUG",
    "THE"
    
  ],

  paths: {

    ALGORITHM: [
      [0,6],[1,6],[2,6],[3,6],
      [4,6],[5,6],[6,6],[7,6],[8,6]
    ],

    WANTS: [
      [2,0],[2,1],[2,2],[2,3],[2,4]
    ],

    HUG: [
      [4,0],[4,1],[4,2]
    ],

    THE: [
      [5,4],[6,4],[7,4]
    ],

  
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
  phrase: "WOW YOU MADE IT WORSE FASTER.",
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
  phrase: "AMAZING YOU BROKE THE SAFE MODE.",
  HINT: "Safety protocols crying.",

  words: ["AMAZING", "YOU", "BROKE", "SAFE", "MODE"],

  paths: {
    AMAZING: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    YOU: [[2,0],[2,1],[2,2]],
    BROKE: [[4,0],[4,1],[4,2],[4,3],[4,4]],
    
    SAFE: [[1,7],[2,7],[3,7],[4,7]],
    MODE: [[8,4],[8,5],[8,6],[8,7]]
  }
},

{
  phrase: "THIS IS PEAK MONKEY ENGINEERING.",
  HINT: "Banana-powered logic detected.",

  words: ["THIS", "PEAK", "MONKEY", "ENGINEERING"],

  paths: {
    THIS: [[0,0],[0,1],[0,2],[0,3]],
   
    PEAK: [[4,0],[4,1],[4,2],[4,3]],
    MONKEY: [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]],
    ENGINEERING: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7]]
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
  phrase: "YOU APPROACH PROBLEMS LIKE A HAMMER.",
  HINT: "Subtlety not installed.",

  words: ["YOU", "APPROACH", "PROBLEMS", "LIKE", "HAMMER"],

  paths: {
    YOU: [[0,0],[0,1],[0,2]],
    APPROACH: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]],
    PROBLEMS: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]],
    LIKE: [[6,0],[6,1],[6,2],[6,3]],
   
    HAMMER: [[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]
  }
},

{
  phrase: "THE SIMULATION IS LOSING PATIENCE.",
  HINT: "Reality sounds annoyed.",

  words: ["SIMULATION", "LOSING", "PATIENCE"],

  paths: {
    
    SIMULATION: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]],
    
    LOSING: [[3,7],[4,7],[5,7],[6,7],[7,7],[8,7]],
    PATIENCE: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]
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
  phrase: "THIS PLAN NEEDS A HELMET.",
  HINT: "Strategy has head trauma.",

  words: ["THIS", "PLAN", "NEEDS", "HELMET"],

  paths: {
    THIS: [[0,0],[0,1],[0,2],[0,3]],
    PLAN: [[2,0],[2,1],[2,2],[2,3]],
    NEEDS: [[4,0],[4,1],[4,2],[4,3],[4,4]],
   
    HELMET: [[5,5],[6,5],[7,5],[8,5],[9,5],[10,5]]
  }
},

{
  phrase: "THAT IDEA NEEDS A WARNING LABEL.",
  HINT: "Caution tape recommended.",

  words: ["THAT", "IDEA", "NEEDS", "WARNING", "LABEL"],

  paths: {
    THAT: [[0,0],[0,1],[0,2],[0,3]],
    IDEA: [[2,0],[2,1],[2,2],[2,3]],
    NEEDS: [[4,0],[4,1],[4,2],[4,3],[4,4]],
   
    WARNING: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    LABEL: [[7,0],[7,1],[7,2],[7,3],[7,4]]
  }
},



{
  phrase: "EVEN THE ERROR IS CONFUSED.",
  HINT: "Failure cannot explain itself.",

  words: ["EVEN", "THE", "ERROR", "CONFUSED"],

  paths: {
    EVEN: [[0,0],[0,1],[0,2],[0,3]],
    THE: [[2,0],[2,1],[2,2]],
    ERROR: [[4,0],[4,1],[4,2],[4,3],[4,4]],
    
    CONFUSED: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]
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
  phrase: "SOMEHOW YOU LOST TO A MENU!",
  HINT: "Navigation defeat confirmed.",

  words: ["SOMEHOW", "YOU", "LOST", "TO", "MENU"],

  paths: {
    SOMEHOW: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]],
    YOU: [[2,0],[2,1],[2,2]],
    LOST: [[4,0],[4,1],[4,2],[4,3]],
    TO: [[6,0],[6,1]],
    
    MENU: [[6,6],[7,6],[8,6],[9,6]]
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
  words: ["SOMETHING", "INSIDE", "CRYING", "THE", "IS", "USB"],
  paths: {
    SOMETHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    INSIDE: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    CRYING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    THE: [[9,0],[9,1],[9,2]],
    USB: [[9,4],[9,5],[9,6]],
    IS: [[5,7], [6,7]]
  }
},

{
  phrase: "THE FIREWALL IS FEELING PARANOID.",
  HINT: "Security has trust issues.",
  words: ["FIREWALL", "FEELING", "PARANOID", "THE", "IS"],
  paths: {
    FIREWALL: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    FEELING: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    PARANOID: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    THE: [[9,0],[9,1],[9,2]],
    IS: [[9,6],[10,6]]
  }
},

{
  phrase: "SOMETHING HERE IS LEAKING ELECTRICITY!",
  HINT: "Unsafe sparkle detected.",
  words: ["SOMETHING", "ELECTRICITY", "LEAKING", "HERE", "IS"],
  paths: {
    SOMETHING: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    ELECTRICITY: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2]],
    LEAKING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    HERE: [[8,4],[8,5],[8,6],[8,7]],
    IS: [[10,5],[10,6]]
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
  phrase: "COMPUTER PANIC LEVELS ARE RISING!",
  HINT: "Digital anxiety increasing.",
  words: ["COMPUTER", "RISING", "LEVELS", "PANIC", "ARE"],
  paths: {
    COMPUTER: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    PANIC: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    LEVELS: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    RISING: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]],
    ARE: [[9,0],[9,1],[9,2]]
  }
},

{
  phrase: "THE BLUETOOTH IS AFRAID OF THUNDER.",
  HINT: "Wireless fear detected.",
  words: ["BLUETOOTH", "THUNDER", "AFRAID", "THE", "IS" ],
  paths: {
    BLUETOOTH: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    THUNDER: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    AFRAID: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    THE: [[9,0],[9,1],[9,2]],
    
    IS: [[10,5],[10,6]]
  }
},

{
  phrase: "THE MAINFRAME IS ASKING WEIRD QUESTIONS...",
  HINT: "Old computer got curious.",
  words: ["MAINFRAME", "QUESTIONS", "ASKING", "WEIRD", "THE", "IS"],
  paths: {
    MAINFRAME: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]],
    QUESTIONS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    ASKING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    WEIRD: [[0,6],[1,6],[2,6],[3,6],[4,6]],
    THE: [[9,0],[9,1],[9,2]],
    IS: [[10,6],[10,7]]
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
  phrase: "YOUR POSTURE TRIGGERED A SYSTEM WARNING.",
  HINT: "Spine stability compromised.",
  words: ["POSTURE", "TRIGGERED", "WARNING", "SYSTEM", "YOUR"],
  paths: {
    POSTURE: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    TRIGGERED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    WARNING: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    SYSTEM: [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]],
    YOUR: [[7,4],[7,5],[7,6],[7,7]]
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
  phrase: "YOU LOOK LIKE YOU SAY TRUST ME TOO MUCH.",
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
  phrase: "YOU LOOK LIKE YOU YELL AT CAPTCHA TESTS.",
  HINT: "Robot verification failed.",
  words: ["CAPTCHA", "TESTS", "YELL", "LOOK", "YOU", "LIKE"],
  paths: {
    CAPTCHA: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    TESTS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YELL: [[0,4],[1,4],[2,4],[3,4]],
    LOOK: [[0,6],[1,6],[2,6],[3,6]],
    YOU: [[7,5],[7,6],[7,7]],
    LIKE: [[8,1], [8,2], [8,3], [8,4]]
    
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
    YOU: [[11,5],[11,6],[11,7]]
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
  phrase: "I AM NOT GOING TO TELL YOU AGAIN STOP SPILLING REDBULL ON ME!",
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
}




];


function startGame() {
  document.getElementById("startScreen").style.display = "none";
  loadWordSignal();
}


function loadWordSignal() {
  currentPuzzle =
    signalPuzzles[
      Math.floor(Math.random() * signalPuzzles.length)
    ];

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



document.addEventListener("pointerdown", startSelect);
document.addEventListener("pointermove", dragSelect);
document.addEventListener("pointerup", endSelect);
document.addEventListener("pointercancel", endSelect);

// wait for START button


