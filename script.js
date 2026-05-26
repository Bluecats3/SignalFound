const decodeMessage =
document.getElementById("signalHint");
const responseOutput = document.getElementById("responseOutput");

 let currentPuzzle;
let foundWords = [];
let selectedTiles = [];
let isDragging = false;
let typingInterval = null;



setInterval(function () {
  const screen = document.getElementById("wordSignalScreen");

  if (!screen) return;

  screen.classList.add("glitching");

  setTimeout(function () {
    screen.classList.remove("glitching");
  }, 600);

}, Math.floor(Math.random() * 4000) + 3000);






const signalPuzzles = [

{
  phrase: "The microwave is judging you",
  hint: "Hint: kitchen appliance signal detected.",
  words: ["THE", "MICROWAVE", "IS", "JUDGING", "YOU"],

  paths: {
    YOU: [[5,0],[6,0],[7,0]],

    JUDGING: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],

    IS: [[0,2],[1,2]],

    MICROWAVE: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],

    THE: [[4,6],[5,6],[6,6]]
  }
},

{
  phrase: "The WIFI has trust issues",
  hint: "Hint: unstable router energy detected.",
  words: ["THE", "WIFI", "HAS", "TRUST", "ISSUES"],

  paths: {
    ISSUES: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],

    TRUST: [[3,1],[4,1],[5,1],[6,1],[7,1]],

    HAS: [[0,2],[1,2],[2,2]],

    WIFI: [[2,4],[3,4],[4,4],[5,4]],

    THE: [[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The signal saw your search history",
  hint: "Hint: browser surveillance detected.",
  words: ["THE","SIGNAL","SAW","YOUR","SEARCH","HISTORY"],

  paths: {
    HISTORY: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],

    SEARCH: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],

    YOUR: [[0,2],[1,2],[2,2],[3,2]],

    SAW: [[5,2],[6,2],[7,2]],

    SIGNAL: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],

    THE: [[7,5],[8,5],[9,5]]
  }
},

{
  phrase: "The machine thinks you need sleep",
  hint: "Hint: exhausted machine energy detected.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","SLEEP"],

  paths: {
    SLEEP: [[2,0],[3,0],[4,0],[5,0],[6,0]],

    NEED: [[0,1],[1,1],[2,1],[3,1]],

    YOU: [[5,1],[6,1],[7,1]],

    THINKS: [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],

    MACHINE: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],

    THE: [[7,6],[8,6],[9,6]]
  }
},






{
  phrase: "The static hates your music",
  hint: "Hint: audio corruption detected.",
  words: ["THE","STATIC","HATES","YOUR","MUSIC"],

  paths: {
    STATIC: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]],
    HATES: [[3,1],[4,1],[5,1],[6,1],[7,1]],
    MUSIC: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    THE: [[2,5],[3,5],[4,5]],
    YOUR: [[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "Your phone is tired of you",
  hint: "Hint: device fatigue detected.",
  words: ["YOUR","PHONE","IS","TIRED","OF","YOU"],

  paths: {
    PHONE: [[1,0],[2,0],[3,0],[4,0],[5,0]],
    TIRED: [[3,1],[4,1],[5,1],[6,1],[7,1]],
    YOUR: [[0,3],[1,3],[2,3],[3,3]],
    IS: [[5,3],[6,3]],
    OF: [[8,3],[9,3]],
    YOU: [[4,5],[5,5],[6,5]]
  }
},

{
  phrase: "The signal watched you reheat pizza",
  hint: "Hint: leftover surveillance detected.",
  words: ["THE","SIGNAL","WATCHED","YOU","REHEAT","PIZZA"],

  paths: {
    WATCHED: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    SIGNAL: [[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    REHEAT: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    PIZZA: [[4,3],[5,3],[6,3],[7,3],[8,3]],
    THE: [[1,5],[2,5],[3,5]],
    YOU: [[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The machine saw you trip again",
  hint: "Hint: floor incident recorded.",
  words: ["THE","MACHINE","SAW","YOU","TRIP","AGAIN"],

  paths: {
    MACHINE: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],
    AGAIN: [[4,1],[5,1],[6,1],[7,1],[8,1]],
    TRIP: [[0,2],[1,2],[2,2],[3,2]],
    THE: [[2,4],[3,4],[4,4]],
    SAW: [[6,4],[7,4],[8,4]],
    YOU: [[1,6],[2,6],[3,6]]
  }
},




{
  phrase: "The static knows you cry in traffic",
  hint: "Hint: commuter emotions detected.",
  words: ["THE","STATIC","KNOWS","YOU","CRY","IN","TRAFFIC"],

  paths: {
    TRAFFIC: [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],

    IN: [[0,1],[1,1]],

    CRY: [[3,1],[4,1],[5,1]],

    YOU: [[6,1],[7,1],[8,1]],

    KNOWS: [[2,3],[3,3],[4,3],[5,3],[6,3]],

    STATIC: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],

    THE: [[5,6],[6,6],[7,6]]
  }
},



{
  phrase: "Your computer needs therapy",
  hint: "Hint: emotional processor detected.",
  words: ["YOUR","COMPUTER","NEEDS","THERAPY"],

  paths: {
    YOUR: [[4,0],[5,0],[6,0],[7,0]],
    COMPUTER: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    NEEDS: [[2,3],[3,3],[4,3],[5,3],[6,3]],
    THERAPY: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]
  }
},

{
  phrase: "The signal heard you talking to yourself",
  hint: "Hint: private conversation detected.",
  words: ["THE","SIGNAL","HEARD","YOU","TALKING","TO","YOURSELF"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    HEARD: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,2],[7,2],[8,2]],
    TALKING: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    TO: [[0,5],[1,5]],
    YOURSELF: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]
  }
},

{
  phrase: "The microwave remembers everything",
  hint: "Hint: appliance memory detected.",
  words: ["THE","MICROWAVE","REMEMBERS","EVERYTHING"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MICROWAVE: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    REMEMBERS: [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    EVERYTHING: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]]
  }
},

{
  phrase: "The system thinks you text too much",
  hint: "Hint: notification overload detected.",
  words: ["THE","SYSTEM","THINKS","YOU","TEXT","TOO","MUCH"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    SYSTEM: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    TEXT: [[5,3],[6,3],[7,3],[8,3]],
    TOO: [[1,5],[2,5],[3,5]],
    MUCH: [[5,5],[6,5],[7,5],[8,5]]
  }
},



{
  phrase: "The machine did not like that decision",
  hint: "Hint: questionable choice detected.",
  words: ["THE","MACHINE","DID","NOT","LIKE","THAT","DECISION"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    DID: [[0,2],[1,2],[2,2]],
    NOT: [[5,2],[6,2],[7,2]],
    LIKE: [[2,4],[3,4],[4,4],[5,4]],
    THAT: [[0,5],[1,5],[2,5],[3,5]],
    DECISION: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The static saw you open the fridge again",
  hint: "Hint: snack surveillance detected.",
  words: ["THE","STATIC","SAW","YOU","OPEN","FRIDGE","AGAIN"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    STATIC: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[0,2],[1,2],[2,2]],
    YOU: [[6,2],[7,2],[8,2]],
    OPEN: [[1,4],[2,4],[3,4],[4,4]],
    FRIDGE: [[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]],
    AGAIN: [[0,6],[1,6],[2,6],[3,6],[4,6]]
  }
},

{
  phrase: "Your laptop is over this",
  hint: "Hint: exhausted hardware detected.",
  words: ["YOUR","LAPTOP","IS","OVER","THIS"],

  paths: {
    YOUR: [[3,0],[4,0],[5,0],[6,0]],
    LAPTOP: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    IS: [[8,1],[9,1]],
    OVER: [[2,3],[3,3],[4,3],[5,3]],
    THIS: [[5,4],[6,4],[7,4],[8,4]]
  }
},

{
  phrase: "The WIFI has questions",
  hint: "Hint: unstable router energy detected.",
  words: ["THE","WIFI","HAS","QUESTIONS"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    WIFI: [[1,1],[2,1],[3,1],[4,1]],
    HAS: [[6,1],[7,1],[8,1]],
    QUESTIONS: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]]
  }
},
  
  


  
  
  
  
  
  
  
  
  {
  phrase: "The signal thinks you need water",
  hint: "Hint: hydration signal detected.",
  words: ["THE","SIGNAL","THINKS","YOU","NEED","WATER"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    NEED: [[4,4],[5,4],[6,4],[7,4]],
    WATER: [[2,6],[3,6],[4,6],[5,6],[6,6]]
  }
},

{
  phrase: "The machine saw that cringe memory too",
  hint: "Hint: cringe archive detected.",
  words: ["THE","MACHINE","SAW","THAT","CRINGE","MEMORY","TOO"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[7,2],[8,2],[9,2]],
    THAT: [[2,3],[3,3],[4,3],[5,3]],
    CRINGE: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    MEMORY: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]],
    TOO: [[0,7],[1,7],[2,7]]
  }
},

{
  phrase: "Your WIFI is gossiping about you",
  hint: "Hint: router gossip detected.",
  words: ["YOUR","WIFI","IS","GOSSIP","ABOUT","YOU"],

  paths: {
    YOUR: [[4,0],[5,0],[6,0],[7,0]],
    WIFI: [[1,1],[2,1],[3,1],[4,1]],
    IS: [[6,1],[7,1]],
    GOSSIP: [[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],
    ABOUT: [[1,5],[2,5],[3,5],[4,5],[5,5]],
    YOU: [[6,6],[7,6],[8,6]]
  }
},






{
  phrase: "The signal thinks that outfit was a risk",
  hint: "Hint: fashion risk detected.",
  words: ["THE","SIGNAL","THINKS","THAT","OUTFIT","WAS","A","RISK"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    THAT: [[6,2],[7,2],[8,2],[9,2]],
    OUTFIT: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    WAS: [[0,5],[1,5],[2,5]],
    A: [[4,5]],
    RISK: [[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The machine saw you google that",
  hint: "Hint: suspicious search detected.",
  words: ["THE","MACHINE","SAW","YOU","GOOGLE","THAT"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[0,2],[1,2],[2,2]],
    YOU: [[6,2],[7,2],[8,2]],
    GOOGLE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    THAT: [[1,5],[2,5],[3,5],[4,5]]
  }
},

{
  phrase: "The signal knows your bedtime is fake",
  hint: "Hint: sleep schedule deception detected.",
  words: ["THE","SIGNAL","KNOWS","YOUR","BEDTIME","IS","FAKE"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    KNOWS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOUR: [[5,2],[6,2],[7,2],[8,2]],
    BEDTIME: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    IS: [[0,5],[1,5]],
    FAKE: [[4,5],[5,5],[6,5],[7,5]]
  }
},

{
  phrase: "The machine is concerned about your diet",
  hint: "Hint: nutrition judgment detected.",
  words: ["THE","MACHINE","IS","CONCERNED","ABOUT","YOUR","DIET"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    IS: [[0,2],[1,2]],
    CONCERNED: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    ABOUT: [[3,5],[4,5],[5,5],[6,5],[7,5]],
    YOUR: [[0,6],[1,6],[2,6],[3,6]],
    DIET: [[5,6],[6,6],[7,6],[8,6]]
  }
},




{
  phrase: "The static saw you ignore that email",
  hint: "Hint: unread message energy detected.",
  words: ["THE","STATIC","SAW","YOU","IGNORE","THAT","EMAIL"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[0,2],[1,2],[2,2]],
    YOU: [[5,2],[6,2],[7,2]],
    IGNORE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    THAT: [[0,5],[1,5],[2,5],[3,5]],
    EMAIL: [[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "Your screen needs a vacation",
  hint: "Hint: exhausted display detected.",
  words: ["YOUR","SCREEN","NEEDS","A","VACATION"],

  paths: {
    YOUR: [[5,0],[6,0],[7,0],[8,0]],
    SCREEN: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    NEEDS: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    A: [[6,3]],
    VACATION: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The signal knows you did not read the terms",
  hint: "Hint: terms unread detected.",
  words: ["THE","SIGNAL","KNOWS","YOU","DID","NOT","READ","TERMS"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    KNOWS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,2],[7,2],[8,2]],
    DID: [[2,4],[3,4],[4,4]],
    NOT: [[6,4],[7,4],[8,4]],
    READ: [[0,5],[1,5],[2,5],[3,5]],
    TERMS: [[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The machine watched you type the wrong password",
  hint: "Hint: password failure detected.",
  words: ["THE","MACHINE","WATCHED","YOU","TYPE","WRONG","PASSWORD"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    WATCHED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    YOU: [[7,2],[8,2],[9,2]],
    TYPE: [[2,4],[3,4],[4,4],[5,4]],
    WRONG: [[4,5],[5,5],[6,5],[7,5],[8,5]],
    PASSWORD: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},






{
  phrase: "The static does not trust your cooking",
  hint: "Hint: suspicious kitchen signal detected.",
  words: ["THE","STATIC","DOES","NOT","TRUST","YOUR","COOKING"],

  paths: {
    THE: [
      [5,0],[6,0],[7,0]
    ],

    STATIC: [
      [1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1]
    ],

    DOES: [
      [0,2],[1,2],[2,2],[3,2]
    ],

    NOT: [
      [5,2],[6,2],[7,2]
    ],

    TRUST: [
      [2,4],[3,4],[4,4],
      [5,4],[6,4]
    ],

    YOUR: [
      [0,5],[1,5],[2,5],[3,5]
    ],

    COOKING: [
      [2,6],[3,6],[4,6],[5,6],
      [6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "The static is tired of your playlist",
  hint: "Hint: playlist fatigue detected.",
  words: ["THE","STATIC","IS","TIRED","OF","YOUR","PLAYLIST"],

  paths: {
    THE: [
      [3,0],[4,0],[5,0]
    ],

    STATIC: [
      [0,1],[1,1],[2,1],
      [3,1],[4,1],[5,1]
    ],

    IS: [
      [7,1],[8,1]
    ],

    TIRED: [
      [2,3],[3,3],[4,3],
      [5,3],[6,3]
    ],

    OF: [
      [8,3],[9,3]
    ],

    YOUR: [
      [1,5],[2,5],[3,5],[4,5]
    ],

    PLAYLIST: [
      [0,6],[1,6],[2,6],[3,6],
      [4,6],[5,6],[6,6],[7,6]
    ]
  }
},

{
  phrase: "Your phone is low on patience",
  hint: "Hint: device patience depleted.",
  words: ["YOUR","PHONE","IS","LOW","ON","PATIENCE"],

  paths: {
    YOUR: [
      [4,0],[5,0],[6,0],[7,0]
    ],

    PHONE: [
      [1,1],[2,1],[3,1],
      [4,1],[5,1]
    ],

    IS: [
      [7,1],[8,1]
    ],

    LOW: [
      [2,3],[3,3],[4,3]
    ],

    ON: [
      [6,3],[7,3]
    ],

    PATIENCE: [
      [1,5],[2,5],[3,5],[4,5],
      [5,5],[6,5],[7,5],[8,5]
    ]
  }
},






{
  phrase: "The signal heard you singing",
  hint: "Hint: vocal signal detected.",
  words: ["THE","SIGNAL","HEARD","YOU","SINGING"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    HEARD: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,2],[7,2],[8,2]],
    SINGING: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]
  }
},

{
  phrase: "The machine thinks you should stretch",
  hint: "Hint: posture warning detected.",
  words: ["THE","MACHINE","THINKS","YOU","SHOULD","STRETCH"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[7,2],[8,2],[9,2]],
    SHOULD: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    STRETCH: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]
  }
},

{
  phrase: "The static watched you miss the exit",
  hint: "Hint: navigation failure detected.",
  words: ["THE","STATIC","WATCHED","YOU","MISS","EXIT"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    WATCHED: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    MISS: [[5,3],[6,3],[7,3],[8,3]],
    EXIT: [[3,5],[4,5],[5,5],[6,5]]
  }
},





{
  phrase: "Your computer needs a hug",
  hint: "Hint: emotional processor detected.",
  words: ["YOUR","COMPUTER","NEEDS","A","HUG"],

  paths: {
    YOUR: [
      [4,0],[5,0],[6,0],[7,0]
    ],

    COMPUTER: [
      [1,1],[2,1],[3,1],[4,1],
      [5,1],[6,1],[7,1],[8,1]
    ],

    NEEDS: [
      [0,3],[1,3],[2,3],[3,3],[4,3]
    ],

    A: [
      [6,3]
    ],

    HUG: [
      [7,3],[8,3],[9,3]
    ]
  }
},

{
  phrase: "The signal saw you pretend to work",
  hint: "Hint: productivity illusion detected.",
  words: ["THE","SIGNAL","SAW","YOU","PRETEND","TO","WORK"],

  paths: {
    THE: [
      [5,0],[6,0],[7,0]
    ],

    SIGNAL: [
      [2,1],[3,1],[4,1],
      [5,1],[6,1],[7,1]
    ],

    SAW: [
      [0,2],[1,2],[2,2]
    ],

    YOU: [
      [5,2],[6,2],[7,2]
    ],

    PRETEND: [
      [1,4],[2,4],[3,4],[4,4],
      [5,4],[6,4],[7,4]
    ],

    TO: [
      [0,5],[1,5]
    ],

    WORK: [
      [4,6],[5,6],[6,6],[7,6]
    ]
  }
},

{
  phrase: "The machine knows you hit snooze again",
  hint: "Hint: alarm betrayal detected.",
  words: ["THE","MACHINE","KNOWS","YOU","HIT","SNOOZE","AGAIN"],

  paths: {
    THE: [
      [3,0],[4,0],[5,0]
    ],

    MACHINE: [
      [1,1],[2,1],[3,1],[4,1],
      [5,1],[6,1],[7,1]
    ],

    KNOWS: [
      [0,2],[1,2],[2,2],[3,2],[4,2]
    ],

    YOU: [
      [6,2],[7,2],[8,2]
    ],

    HIT: [
      [2,4],[3,4],[4,4]
    ],

    SNOOZE: [
      [0,5],[1,5],[2,5],
      [3,5],[4,5],[5,5]
    ],

    AGAIN: [
      [4,6],[5,6],[6,6],[7,6],[8,6]
    ]
  }
},





{
  phrase: "Your WIFI saw the whole argument",
  hint: "Hint: router witness detected.",
  words: ["YOUR","WIFI","SAW","THE","WHOLE","ARGUMENT"],

  paths: {
    YOUR: [
      [2,0],[3,0],[4,0],[5,0]
    ],

    WIFI: [
      [6,1],[7,1],[8,1],[9,1]
    ],

    SAW: [
      [1,2],[2,2],[3,2]
    ],

    THE: [
      [5,3],[6,3],[7,3]
    ],

    WHOLE: [
      [0,5],[1,5],[2,5],[3,5],[4,5]
    ],

    ARGUMENT: [
      [1,6],[2,6],[3,6],[4,6],
      [5,6],[6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "The signal is laughing quietly",
  hint: "Hint: quiet laughter detected.",
  words: ["THE","SIGNAL","IS","LAUGHING","QUIETLY"],

  paths: {
    THE: [
      [4,0],[5,0],[6,0]
    ],

    SIGNAL: [
      [1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1]
    ],

    IS: [
      [8,1],[9,1]
    ],

    LAUGHING: [
      [0,3],[1,3],[2,3],[3,3],
      [4,3],[5,3],[6,3],[7,3]
    ],

    QUIETLY: [
      [2,5],[3,5],[4,5],[5,5],
      [6,5],[7,5],[8,5]
    ]
  }
},






{
  phrase: "The static saw you drop your phone",
  hint: "Hint: impact event detected.",
  words: ["THE","STATIC","SAW","YOU","DROP","YOUR","PHONE"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],

    STATIC: [
      [1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1]
    ],

    SAW: [
      [7,2],[8,2],[9,2]
    ],

    YOU: [
      [1,3],[2,3],[3,3]
    ],

    DROP: [
      [5,3],[6,3],[7,3],[8,3]
    ],

    YOUR: [
      [2,5],[3,5],[4,5],[5,5]
    ],

    PHONE: [
      [4,6],[5,6],[6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "Your device thinks you need sunlight",
  hint: "Hint: outdoor exposure recommended.",
  words: ["YOUR","DEVICE","THINKS","YOU","NEED","SUNLIGHT"],

  paths: {
    YOUR: [
      [5,0],[6,0],[7,0],[8,0]
    ],

    DEVICE: [
      [0,1],[1,1],[2,1],
      [3,1],[4,1],[5,1]
    ],

    THINKS: [
      [2,2],[3,2],[4,2],
      [5,2],[6,2],[7,2]
    ],

    YOU: [
      [0,3],[1,3],[2,3]
    ],

    NEED: [
      [5,4],[6,4],[7,4],[8,4]
    ],

    SUNLIGHT: [
      [1,6],[2,6],[3,6],[4,6],
      [5,6],[6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "The signal watched you panic clean",
  hint: "Hint: emergency cleaning detected.",
  words: ["THE","SIGNAL","WATCHED","YOU","PANIC","CLEAN"],

  paths: {
    THE: [
      [4,0],[5,0],[6,0]
    ],

    SIGNAL: [
      [1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1]
    ],

    WATCHED: [
      [2,2],[3,2],[4,2],[5,2],
      [6,2],[7,2],[8,2]
    ],

    YOU: [
      [0,3],[1,3],[2,3]
    ],

    PANIC: [
      [4,4],[5,4],[6,4],[7,4],[8,4]
    ],

    CLEAN: [
      [1,5],[2,5],[3,5],[4,5],[5,5]
    ]
  }
},







{
  phrase: "The machine knows you did not save the file",
  hint: "Hint: unsaved file detected.",
  words: ["THE","MACHINE","KNOWS","YOU","DID","NOT","SAVE","FILE"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],

    MACHINE: [
      [2,1],[3,1],[4,1],[5,1],
      [6,1],[7,1],[8,1]
    ],

    KNOWS: [
      [0,2],[1,2],[2,2],[3,2],[4,2]
    ],

    YOU: [
      [6,2],[7,2],[8,2]
    ],

    DID: [
      [3,3],[4,3],[5,3]
    ],

    NOT: [
      [7,3],[8,3],[9,3]
    ],

    SAVE: [
      [1,5],[2,5],[3,5],[4,5]
    ],

    FILE: [
      [5,6],[6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "The static remembers the group chat",
  hint: "Hint: group chat memory detected.",
  words: ["THE","STATIC","REMEMBERS","GROUP","CHAT"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],

    STATIC: [
      [1,1],[2,1],[3,1],[4,1],
      [5,1],[6,1]
    ],

    REMEMBERS: [
      [0,2],[1,2],[2,2],[3,2],[4,2],
      [5,2],[6,2],[7,2],[8,2]
    ],

    GROUP: [
      [2,4],[3,4],[4,4],[5,4],[6,4]
    ],

    CHAT: [
      [5,6],[6,6],[7,6],[8,6]
    ]
  }
},






{
  phrase: "The machine thinks you need a nap",
  hint: "Hint: nap recommendation detected.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","A","NAP"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],

    MACHINE: [
      [2,1],[3,1],[4,1],[5,1],
      [6,1],[7,1],[8,1]
    ],

    THINKS: [
      [0,2],[1,2],[2,2],[3,2],
      [4,2],[5,2]
    ],

    YOU: [
      [5,3],[6,3],[7,3]
    ],

    NEED: [
      [2,4],[3,4],[4,4],[5,4]
    ],

    A: [
      [8,5]
    ],

    NAP: [
      [4,6],[5,6],[6,6]
    ]
  }
},

{
  phrase: "The machine is confused by your tabs",
  hint: "Hint: tab overload detected.",
  words: ["THE","MACHINE","IS","CONFUSED","BY","YOUR","TABS"],

  paths: {
    THE: [
      [6,0],[7,0],[8,0]
    ],

    MACHINE: [
      [1,1],[2,1],[3,1],[4,1],
      [5,1],[6,1],[7,1]
    ],

    IS: [
      [3,2],[4,2]
    ],

    CONFUSED: [
      [0,3],[1,3],[2,3],[3,3],
      [4,3],[5,3],[6,3],[7,3]
    ],

    BY: [
      [8,4],[9,4]
    ],

    YOUR: [
      [2,5],[3,5],[4,5],[5,5]
    ],

    TABS: [
      [5,6],[6,6],[7,6],[8,6]
    ]
  }
},

{
  phrase: "The static thinks your pet is in charge",
  hint: "Hint: pet authority detected.",
  words: ["THE","STATIC","THINKS","YOUR","PET","IS","IN","CHARGE"],

  paths: {
    THE: [
      [3,0],[4,0],[5,0]
    ],

    STATIC: [
      [0,1],[1,1],[2,1],[3,1],
      [4,1],[5,1]
    ],

    THINKS: [
      [2,2],[3,2],[4,2],[5,2],
      [6,2],[7,2]
    ],

    YOUR: [
      [5,3],[6,3],[7,3],[8,3]
    ],

    PET: [
      [1,4],[2,4],[3,4]
    ],

    IS: [
      [7,5],[8,5]
    ],

    IN: [
      [0,6],[1,6]
    ],

    CHARGE: [
      [2,7],[3,7],[4,7],
      [5,7],[6,7],[7,7]
    ]
  }
},






{
  phrase: "Your computer missed the deadline too",
  hint: "Hint: the machine relates to procrastination.",
  words: ["YOUR","COMPUTER","MISSED","THE","DEADLINE","TOO"],

  paths: {
    YOUR: [[4,0],[5,0],[6,0],[7,0]],
    COMPUTER: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    MISSED: [[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    THE: [[0,4],[1,4],[2,4]],
    DEADLINE: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]],
    TOO: [[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The signal knows you avoid phone calls",
  hint: "Hint: incoming contact avoided.",
  words: ["THE","SIGNAL","KNOWS","YOU","AVOID","PHONE","CALLS"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    KNOWS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,3],[7,3],[8,3]],
    AVOID: [[1,4],[2,4],[3,4],[4,4],[5,4]],
    PHONE: [[3,5],[4,5],[5,5],[6,5],[7,5]],
    CALLS: [[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The machine thinks you buy too many snacks",
  hint: "Hint: snack levels exceed protocol.",
  words: ["THE","MACHINE","THINKS","YOU","BUY","TOO","MANY","SNACKS"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    YOU: [[0,3],[1,3],[2,3]],
    BUY: [[5,3],[6,3],[7,3]],
    TOO: [[1,4],[2,4],[3,4]],
    MANY: [[5,5],[6,5],[7,5],[8,5]],
    SNACKS: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},



{
  phrase: "The static watched you dance alone",
  hint: "Hint: unauthorized living room movement detected.",
  words: ["THE","STATIC","WATCHED","YOU","DANCE","ALONE"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    WATCHED: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    DANCE: [[4,4],[5,4],[6,4],[7,4],[8,4]],

    ALONE: [[0,6],[1,6],[2,6],[3,6],[4,6]]
  }
},

{
  phrase: "Your device saw the spelling mistake",
  hint: "Hint: typo detected and archived forever.",
  words: ["YOUR","DEVICE","SAW","THE","SPELLING","MISTAKE"],

  paths: {
    YOUR: [[3,0],[4,0],[5,0],[6,0]],
    DEVICE: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
    SAW: [[7,2],[8,2],[9,2]],
    THE: [[1,3],[2,3],[3,3]],
    SPELLING: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    MISTAKE: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]
  }
},

{
  phrase: "The signal thinks you should log off",
  hint: "Hint: the transmission recommends rest.",
  words: ["THE","SIGNAL","THINKS","YOU","SHOULD","LOG","OFF"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[6,3],[7,3],[8,3]],
    SHOULD: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],

    LOG: [[0,6],[1,6],[2,6]],
    OFF: [[5,6],[6,6],[7,6]]
  }
},



{
  phrase: "The static knows you skipped breakfast",
  hint: "Hint: morning fuel was not detected.",
  words: ["THE","STATIC","KNOWS","YOU","SKIPPED","BREAKFAST"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    KNOWS: [[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[6,0],[7,0],[8,0]],
    SKIPPED: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    BREAKFAST: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "Your screen is trying its best",
  hint: "Hint: the display is emotionally invested.",
  words: ["YOUR","SCREEN","IS","TRYING","ITS","BEST"],

  paths: {
    YOUR: [[5,0],[6,0],[7,0],[8,0]],
    SCREEN: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    IS: [[0,2],[1,2]],
    TRYING: [[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    ITS: [[1,5],[2,5],[3,5]],
    BEST: [[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The signal saw you delete that message",
  hint: "Hint: erased transmissions were observed.",
  words: ["THE","SIGNAL","SAW","YOU","DELETE","THAT","MESSAGE"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[0,2],[1,2],[2,2]],
    YOU: [[6,2],[7,2],[8,2]],
    DELETE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    THAT: [[1,5],[2,5],[3,5],[4,5]],
    MESSAGE: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},






{
  phrase: "The machine remembers the cringe",
  hint: "Hint: embarrassing data permanently saved.",
  words: ["THE","MACHINE","REMEMBERS","CRINGE"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    MACHINE: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    REMEMBERS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    CRINGE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]
  }
},

{
  phrase: "The static thinks you need a walk",
  hint: "Hint: outdoor movement advised.",
  words: ["THE","STATIC","THINKS","YOU","NEED","A","WALK"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    NEED: [[5,4],[6,4],[7,4],[8,4]],
    A: [[9,5]],
    WALK: [[2,6],[3,6],[4,6],[5,6]]
  }
},

{
  phrase: "The signal knows you talk to your pet",
  hint: "Hint: animal conversations detected.",
  words: ["THE","SIGNAL","KNOWS","YOU","TALK","TO","YOUR","PET"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    KNOWS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,3],[7,3],[8,3]],
    TALK: [[3,4],[4,4],[5,4],[6,4]],
    TO: [[0,5],[1,5]],
    YOUR: [[4,6],[5,6],[6,6],[7,6]],
    PET: [[7,7],[8,7],[9,7]]
  }
},

{
  phrase: "Your device does not trust that recipe",
  hint: "Hint: cooking confidence critically low.",
  words: ["YOUR","DEVICE","DOES","NOT","TRUST","THAT","RECIPE"],

  paths: {
    YOUR: [[3,0],[4,0],[5,0],[6,0]],
    DEVICE: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
    DOES: [[6,2],[7,2],[8,2],[9,2]],
    NOT: [[1,3],[2,3],[3,3]],
    TRUST: [[4,4],[5,4],[6,4],[7,4],[8,4]],
    THAT: [[2,5],[3,5],[4,5],[5,5]],
    RECIPE: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]]
  }
},

{
  phrase: "Your screen saw the panic google search",
  hint: "Hint: emergency searching detected.",
  words: ["YOUR","SCREEN","SAW","THE","PANIC","GOOGLE","SEARCH"],

  paths: {
    YOUR: [[4,0],[5,0],[6,0],[7,0]],
    SCREEN: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[7,2],[8,2],[9,2]],
    THE: [[2,3],[3,3],[4,3]],
    PANIC: [[5,4],[6,4],[7,4],[8,4],[9,4]],
    GOOGLE: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    SEARCH: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The signal thinks you should call your mom",
  hint: "Hint: family contact recommended.",
  words: ["THE","SIGNAL","THINKS","YOU","SHOULD","CALL","YOUR","MOM"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[6,3],[7,3],[8,3]],
    SHOULD: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    CALL: [[4,5],[5,5],[6,5],[7,5]],
    YOUR: [[0,6],[1,6],[2,6],[3,6]],
    MOM: [[7,7],[8,7],[9,7]]
  }
},

{
  phrase: "The machine saw you ignore the laundry",
  hint: "Hint: chore avoidance detected.",
  words: ["THE","MACHINE","SAW","YOU","IGNORE","LAUNDRY"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    MACHINE: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[6,2],[7,2],[8,2]],
    YOU: [[1,3],[2,3],[3,3]],
    IGNORE: [[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    LAUNDRY: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The static is rooting for chaos",
  hint: "Hint: disorder has a fan.",
  words: ["THE","STATIC","IS","ROOTING","FOR","CHAOS"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    STATIC: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    IS: [[0,2],[1,2]],
    ROOTING: [[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    FOR: [[5,4],[6,4],[7,4]],
    CHAOS: [[1,5],[2,5],[3,5],[4,5],[5,5]]
  }
},

{
  phrase: "The signal watched you miss the obvious",
  hint: "Hint: the easy answer was nearby.",
  words: ["THE","SIGNAL","WATCHED","YOU","MISS","OBVIOUS"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],
    SIGNAL: [[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]],
    WATCHED: [[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    YOU: [[6,3],[7,3],[8,3]],
    MISS: [[0,4],[1,4],[2,4],[3,4]],
    OBVIOUS: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The machine thinks you need a snack",
  hint: "Hint: emergency snack mode active.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","A","SNACK"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    NEED: [[4,4],[5,4],[6,4],[7,4]],
    A: [[9,5]],
    SNACK: [[2,6],[3,6],[4,6],[5,6],[6,6]]
  }
},






{
  phrase: "The static saw the whole thing",
  hint: "Hint: full incident recorded.",
  words: ["THE","STATIC","SAW","WHOLE","THING"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    STATIC: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[0,2],[1,2],[2,2]],
    WHOLE: [[5,3],[6,3],[7,3],[8,3],[9,3]],
    THING: [[3,5],[4,5],[5,5],[6,5],[7,5]]
  }
},

{
  phrase: "Your device knows you are stalling",
  hint: "Hint: delay tactics identified.",
  words: ["YOUR","DEVICE","KNOWS","YOU","ARE","STALLING"],

  paths: {
    YOUR: [[3,0],[4,0],[5,0],[6,0]],
    DEVICE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    KNOWS: [[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    ARE: [[6,4],[7,4],[8,4]],
    STALLING: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The signal thinks your plants are thirsty",
  hint: "Hint: plant hydration alert.",
  words: ["THE","SIGNAL","THINKS","YOUR","PLANTS","ARE","THIRSTY"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOUR: [[4,3],[5,3],[6,3],[7,3]],
    PLANTS: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    ARE: [[7,5],[8,5],[9,5]],
    THIRSTY: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The machine saw you open the same app again",
  hint: "Hint: repeat app behavior detected.",
  words: ["THE","MACHINE","SAW","YOU","OPEN","SAME","APP","AGAIN"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    OPEN: [[4,3],[5,3],[6,3],[7,3]],
    SAME: [[2,4],[3,4],[4,4],[5,4]],
    APP: [[6,5],[7,5],[8,5]],
    AGAIN: [[3,6],[4,6],[5,6],[6,6],[7,6]]
  }
},

{
  phrase: "The static thinks you should go outside",
  hint: "Hint: fresh air recommended.",
  words: ["THE","STATIC","THINKS","YOU","SHOULD","GO","OUTSIDE"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    SHOULD: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
    GO: [[7,5],[8,5]],
    OUTSIDE: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "Your screen is quietly concerned",
  hint: "Hint: silent worry detected.",
  words: ["YOUR","SCREEN","IS","QUIETLY","CONCERNED"],

  paths: {
    YOUR: [[2,0],[3,0],[4,0],[5,0]],
    SCREEN: [[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]],
    IS: [[0,2],[1,2]],
    QUIETLY: [[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    CONCERNED: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]]
  }
},

{
  phrase: "The machine thinks you need more ram",
  hint: "Hint: memory shortage suspected.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","MORE","RAM"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MACHINE: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[6,3],[7,3],[8,3]],
    NEED: [[1,4],[2,4],[3,4],[4,4]],
    MORE: [[5,5],[6,5],[7,5],[8,5]],
    RAM: [[2,6],[3,6],[4,6]]
  }
},





{
  phrase: "The static saw your typing speed drop",
  hint: "Hint: keyboard confidence decreased.",
  words: ["THE","STATIC","SAW","YOUR","TYPING","SPEED","DROP"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    STATIC: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[6,2],[7,2],[8,2]],
    YOUR: [[2,3],[3,3],[4,3],[5,3]],
    TYPING: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    SPEED: [[4,5],[5,5],[6,5],[7,5],[8,5]],
    DROP: [[1,6],[2,6],[3,6],[4,6]]
  }
},

{
  phrase: "Your WIFI is hanging on by a thread",
  hint: "Hint: weak connection holding on.",
  words: ["YOUR","WIFI","IS","HANGING","ON","BY","A","THREAD"],

  paths: {
    YOUR: [[5,0],[6,0],[7,0],[8,0]],
    WIFI: [[1,1],[2,1],[3,1],[4,1]],
    IS: [[8,1],[9,1]],
    HANGING: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    ON: [[0,3],[1,3]],
    BY: [[4,3],[5,3]],
    A: [[9,3]],
    THREAD: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]
  }
},

{
  phrase: "The static thinks you should delete some photos",
  hint: "Hint: storage cleanup advised.",
  words: ["THE","STATIC","THINKS","YOU","SHOULD","DELETE","SOME","PHOTOS"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],
    STATIC: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[6,0],[7,0],[8,0]],
    SHOULD: [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3]],
    DELETE: [[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    SOME: [[0,5],[1,5],[2,5],[3,5]],
    PHOTOS: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]
  }
},

{
  phrase: "Your device is impressed you made it this far",
  hint: "Hint: unlikely progress detected.",
  words: ["YOUR","DEVICE","IS","IMPRESSED","YOU","MADE","IT","THIS","FAR"],

  paths: {
    YOUR: [[1,0],[2,0],[3,0],[4,0]],
    DEVICE: [[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    IS: [[0,2],[1,2]],
    IMPRESSED: [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    YOU: [[5,4],[6,4],[7,4]],
    MADE: [[0,5],[1,5],[2,5],[3,5]],
    IT: [[7,5],[8,5]],
    THIS: [[2,6],[3,6],[4,6],[5,6]],
    FAR: [[6,7],[7,7],[8,7]]
  }
},

{
  phrase: "The signal saw you trip over nothing",
  hint: "Hint: invisible obstacle confirmed.",
  words: ["THE","SIGNAL","SAW","YOU","TRIP","OVER","NOTHING"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    SAW: [[7,0],[8,0],[9,0]],
    YOU: [[0,2],[1,2],[2,2]],
    TRIP: [[3,3],[4,3],[5,3],[6,3]],
    OVER: [[6,4],[7,4],[8,4],[9,4]],
    NOTHING: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The machine thinks you need better sleep",
  hint: "Hint: rest protocol recommended.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","BETTER","SLEEP"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    NEED: [[4,4],[5,4],[6,4],[7,4]],
    BETTER: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]],
    SLEEP: [[5,6],[6,6],[7,6],[8,6],[9,6]]
  }
},

{
  phrase: "Your screen thinks you should touch grass",
  hint: "Hint: outside contact advised.",
  words: ["YOUR","SCREEN","THINKS","YOU","SHOULD","TOUCH","GRASS"],

  paths: {
    YOUR: [[2,0],[3,0],[4,0],[5,0]],
    SCREEN: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[6,3],[7,3],[8,3]],
    SHOULD: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    TOUCH: [[4,5],[5,5],[6,5],[7,5],[8,5]],
    GRASS: [[2,6],[3,6],[4,6],[5,6],[6,6]]
  }
},








{
  phrase: "The signal watched you reheat coffee again",
  hint: "Hint: coffee loop detected.",
  words: ["THE","SIGNAL","WATCHED","YOU","REHEAT","COFFEE","AGAIN"],

  paths: {
    THE: [[6,0],[7,0],[8,0]],
    SIGNAL: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    WATCHED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    YOU: [[5,3],[6,3],[7,3]],
    REHEAT: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    COFFEE: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    AGAIN: [[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The machine knows you talk during movies",
  hint: "Hint: theater crimes detected.",
  words: ["THE","MACHINE","KNOWS","YOU","TALK","DURING","MOVIES"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    MACHINE: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    KNOWS: [[0,2],[1,2],[2,2],[3,2],[4,2]],
    YOU: [[6,3],[7,3],[8,3]],
    TALK: [[3,4],[4,4],[5,4],[6,4]],
    DURING: [[1,5],[2,5],[3,5],[4,5],[5,5],[6,5]],
    MOVIES: [[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]
  }
},

{
  phrase: "Your wifi needs a moment",
  hint: "Hint: connection patience required.",
  words: ["YOUR","WIFI","NEEDS","A","MOMENT"],

  paths: {
    YOUR: [[4,0],[5,0],[6,0],[7,0]],
    WIFI: [[1,1],[2,1],[3,1],[4,1]],
    NEEDS: [[3,2],[4,2],[5,2],[6,2],[7,2]],
    A: [[8,3]],
    MOMENT: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]]
  }
},






{
  phrase: "The machine thinks you need to hydrate",
  hint: "Hint: water level too low.",
  words: ["THE","MACHINE","THINKS","YOU","NEED","TO","HYDRATE"],

  paths: {
    THE: [[4,0],[5,0],[6,0]],
    MACHINE: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[6,3],[7,3],[8,3]],
    NEED: [[0,4],[1,4],[2,4],[3,4]],
    TO: [[7,5],[8,5]],
    HYDRATE: [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The static saw you ignore the update",
  hint: "Hint: update ignored successfully.",
  words: ["THE","STATIC","SAW","YOU","IGNORE","UPDATE"],

  paths: {
    THE: [[5,0],[6,0],[7,0]],
    STATIC: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    SAW: [[0,2],[1,2],[2,2]],
    YOU: [[6,3],[7,3],[8,3]],
    IGNORE: [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    UPDATE: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]]
  }
},

{
  phrase: "The signal knows you are pretending to understand",
  hint: "Hint: fake confidence detected.",
  words: ["THE","SIGNAL","KNOWS","YOU","ARE","PRETEND","TO","UNDERSTAND"],

  paths: {
    THE: [[3,0],[4,0],[5,0]],
    SIGNAL: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]],
    KNOWS: [[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOU: [[0,3],[1,3],[2,3]],
    ARE: [[6,3],[7,3],[8,3]],
    PRETEND: [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    TO: [[8,5],[9,5]],
    UNDERSTAND: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]
  }
},








{
  phrase: "Your terminal thinks the vibes are off",
  hint: "Hint: suspicious vibe reading detected.",
  words: ["YOUR","TERMINAL","THINKS","VIBES","ARE","OFF"],

  paths: {
    YOUR: [[1,0],[2,0],[3,0],[4,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    VIBES: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    ARE: [[5,4],[6,4],[7,4]],
    OFF: [[2,5],[3,5],[4,5]]
  }
},

{
  phrase: "The terminal heard you say it should work",
  hint: "Hint: dangerous optimism detected.",
  words: ["THE","TERMINAL","HEARD","YOU","SAY","IT","SHOULD","WORK"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    HEARD: [[3,2],[4,2],[5,2],[6,2],[7,2]],
    YOU: [[0,3],[1,3],[2,3]],
    SAY: [[4,3],[5,3],[6,3]],
    IT: [[8,3],[9,3]],
    SHOULD: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],
    WORK: [[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "Your terminal thinks you open apps for comfort",
  hint: "Hint: comfort apps detected.",
  words: ["YOUR","TERMINAL","THINKS","YOU","OPEN","APPS","FOR","COMFORT"],

  paths: {
    YOUR: [[1,0],[2,0],[3,0],[4,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    YOU: [[0,3],[1,3],[2,3]],
    OPEN: [[4,3],[5,3],[6,3],[7,3]],
    APPS: [[1,4],[2,4],[3,4],[4,4]],
    FOR: [[6,4],[7,4],[8,4]],
    COMFORT: [[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]]
  }
},

{
  phrase: "The mainframe detected emotional buffering",
  hint: "Hint: feelings are loading slowly.",
  words: ["THE","MAINFRAME","DETECTED","EMOTIONAL","BUFFERING"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],
    MAINFRAME: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    DETECTED: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]],
    EMOTIONAL: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3]],
    BUFFERING: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]]
  }
},







{
  phrase: "The terminal is concerned about your energy drinks",
  hint: "Hint: caffeine levels are alarming.",
  words: ["THE","TERMINAL","IS","CONCERNED","ABOUT","YOUR","ENERGY","DRINKS"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],

    TERMINAL: [
      [0,1],[1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1],[7,1]
    ],

    IS: [[7,0],[8,0]],

    CONCERNED: [
      [1,2],[2,2],[3,2],[4,2],
      [5,2],[6,2],[7,2],[8,2],[9,2]
    ],

    ABOUT: [
      [0,3],[1,3],[2,3],[3,3],[4,3]
    ],

    YOUR: [
      [5,4],[6,4],[7,4],[8,4]
    ],

    ENERGY: [
      [1,5],[2,5],[3,5],[4,5],[5,5],[6,5]
    ],

    DRINKS: [
      [2,6],[3,6],[4,6],[5,6],[6,6],[7,6]
    ]
  }
},

{
  phrase: "The mainframe thinks you walk too fast in stores",
  hint: "Hint: suspicious store speed detected.",
  words: ["THE","MAINFRAME","THINKS","YOU","WALK","TOO","FAST","IN","STORES"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],

    MAINFRAME: [
      [0,1],[1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1],[7,1],[8,1]
    ],

    THINKS: [
      [1,2],[2,2],[3,2],[4,2],[5,2],[6,2]
    ],

    YOU: [
      [0,3],[1,3],[2,3]
    ],

    WALK: [
      [5,3],[6,3],[7,3],[8,3]
    ],

    TOO: [
      [2,4],[3,4],[4,4]
    ],

    FAST: [
      [5,5],[6,5],[7,5],[8,5]
    ],

    IN: [
      [0,6],[1,6]
    ],

    STORES: [
      [3,7],[4,7],[5,7],[6,7],[7,7],[8,7]
    ]
  }
},

{
  phrase: "Your terminal watched you rewrite the same text",
  hint: "Hint: repeated sentence activity detected.",
  words: ["YOUR","TERMINAL","WATCHED","YOU","REWRITE","SAME","TEXT"],

  paths: {
    YOUR: [
      [1,0],[2,0],[3,0],[4,0]
    ],

    TERMINAL: [
      [0,1],[1,1],[2,1],[3,1],
      [4,1],[5,1],[6,1],[7,1]
    ],

    WATCHED: [
      [2,2],[3,2],[4,2],[5,2],
      [6,2],[7,2],[8,2]
    ],

    YOU: [
      [0,3],[1,3],[2,3]
    ],

    REWRITE: [
      [1,4],[2,4],[3,4],[4,4],
      [5,4],[6,4],[7,4]
    ],

    SAME: [
      [5,5],[6,5],[7,5],[8,5]
    ],

    TEXT: [
      [2,6],[3,6],[4,6],[5,6]
    ]
  }
},








{
  phrase: "The terminal thinks you were never going to fix that",
  hint: "Hint: repair confidence not found.",
  words: ["THE","TERMINAL","THINKS","YOU","WERE","NEVER","GOING","TO","FIX","THAT"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    YOU: [[0,3],[1,3],[2,3]],
    WERE: [[5,3],[6,3],[7,3],[8,3]],
    NEVER: [[1,4],[2,4],[3,4],[4,4],[5,4]],
    GOING: [[5,5],[6,5],[7,5],[8,5],[9,5]],
    TO: [[0,6],[1,6]],
    FIX: [[3,6],[4,6],[5,6]],
    THAT: [[2,7],[3,7],[4,7],[5,7]]
  }
},


{
  phrase: "The mainframe is studying your microwave habits",
  hint: "Hint: appliance behavior under review.",
  words: ["THE","MAINFRAME","IS","STUDYING","YOUR","MICROWAVE","HABITS"],

  paths: {
    THE: [[2,0],[3,0],[4,0]],
    MAINFRAME: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    IS: [[7,0],[8,0]],
    STUDYING: [[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    YOUR: [[0,3],[1,3],[2,3],[3,3]],
    MICROWAVE: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    HABITS: [[3,6],[4,6],[5,6],[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "Your terminal thinks the group chat fears you",
  hint: "Hint: group chat threat level noted.",
  words: ["YOUR","TERMINAL","THINKS","GROUP","CHAT","FEARS","YOU"],

  paths: {
    YOUR: [[1,0],[2,0],[3,0],[4,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    THINKS: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    GROUP: [[0,3],[1,3],[2,3],[3,3],[4,3]],
    CHAT: [[5,4],[6,4],[7,4],[8,4]],
    FEARS: [[1,5],[2,5],[3,5],[4,5],[5,5]],
    YOU: [[6,6],[7,6],[8,6]]
  }
},

{
  phrase: "The mainframe saw you pretend to understand the instructions",
  hint: "Hint: fake comprehension detected.",
  words: ["THE","MAINFRAME","SAW","YOU","PRETEND","TO","UNDERSTAND","INSTRUCTS"],

  paths: {
    THE: [[1,0],[2,0],[3,0]],
    MAINFRAME: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    SAW: [[4,0],[5,0],[6,0]],
    YOU: [[7,0],[8,0],[9,0]],
    PRETEND: [[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
    TO: [[0,3],[1,3]],
    UNDERSTAND: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4]],
    INSTRUCTS: [[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]
  }
},



















{
  phrase: "The terminal detected a confidently wrong answer",
  hint: "Hint: bold incorrectness detected.",
  words: ["THE","TERMINAL","DETECTED","A","CONFIDENT","WRONG","ANSWER"],

  paths: {
    THE: [[0,0],[1,0],[2,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    DETECTED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]],
    A: [[0,3]],
    CONFIDENT: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    WRONG: [[0,5],[1,5],[2,5],[3,5],[4,5]],
    ANSWER: [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]]
  }
},

{
  phrase: "The mainframe thinks you have too many screenshots",
  hint: "Hint: image hoarding detected.",
  words: ["THE","MAINFRAME","THINKS","YOU","HAVE","TOO","MANY","SCREENSHOT"],

  paths: {
    THE: [[0,0],[1,0],[2,0]],
    MAINFRAME: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[0,3],[1,3],[2,3]],
    HAVE: [[4,3],[5,3],[6,3],[7,3]],
    TOO: [[0,4],[1,4],[2,4]],
    MANY: [[4,4],[5,4],[6,4],[7,4]],
    SCREENSHOT: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]]
  }
},

{
  phrase: "Your terminal watched you forget why you opened the app",
  hint: "Hint: purpose lost during launch.",
  words: ["YOUR","TERMINAL","WATCHED","YOU","FORGET","WHY","OPENED","APP"],

  paths: {
    YOUR: [[0,0],[1,0],[2,0],[3,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    WATCHED: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]],
    YOU: [[0,3],[1,3],[2,3]],
    FORGET: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4]],
    WHY: [[7,4],[8,4],[9,4]],
    OPENED: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]],
    APP: [[0,6],[1,6],[2,6]]
  }
},

{
  phrase: "The mainframe thinks you need a different hobby",
  hint: "Hint: hobby recommendation pending.",
  words: ["THE","MAINFRAME","THINKS","YOU","NEED","A","DIFFERENT","HOBBY"],

  paths: {
    THE: [[0,0],[1,0],[2,0]],
    MAINFRAME: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]],
    THINKS: [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
    YOU: [[0,3],[1,3],[2,3]],
    NEED: [[4,3],[5,3],[6,3],[7,3]],
    A: [[9,3]],
    DIFFERENT: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
    HOBBY: [[0,5],[1,5],[2,5],[3,5],[4,5]]
  }
},

{
  phrase: "The terminal is still processing that decision",
  hint: "Hint: decision still under review.",
  words: ["THE","TERMINAL","IS","STILL","PROCESSING","THAT","DECISION"],

  paths: {
    THE: [[0,0],[1,0],[2,0]],
    TERMINAL: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    IS: [[0,2],[1,2]],
    STILL: [[3,2],[4,2],[5,2],[6,2],[7,2]],
    PROCESSING: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3]],
    THAT: [[0,4],[1,4],[2,4],[3,4]],
    DECISION: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]]
  }
}



];



function loadWordSignal() {
  currentPuzzle =
    signalPuzzles[
      Math.floor(Math.random() * signalPuzzles.length)
    ];

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
    currentPuzzle.hint;

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
e.preventDefault();

  isDragging = true;
  clearSelection();
  selectedTiles = [];
  
  e.target.setPointerCapture(e.pointerId);
  selectTile(e.target);
}

function dragSelect(e) {
  if (!isDragging) return;

  e.preventDefault();

  const tile = document.elementFromPoint(
    e.clientX,
    e.clientY
  );

  if (tile && tile.classList.contains("letterTile")) {
    selectTile(tile);
  }
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

document.addEventListener("pointerup", endSelect);
document.addEventListener("pointercancel", endSelect);

function checkPuzzleComplete() {
  if (foundWords.length === currentPuzzle.words.length) {
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

function checkPuzzleComplete() {
  if (foundWords.length === currentPuzzle.words.length) {
    const sound = document.getElementById("signalSound");

    if (sound) {
      sound.currentTime = 0;

      sound.play().catch(error => {
        console.log("Sound blocked or missing:", error);
      });
    }

    typeSystemResponse(currentPuzzle.phrase);
  }
}

document.addEventListener("pointerup", endSelect);
document.addEventListener("pointercancel", endSelect);

loadWordSignal();


