// === MEMORY (PERSISTENT) ===
const STORAGE_KEY = "signalFound";
let memory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// === LIMIT + CACHE ===
let requestCount = 0;
const cache = {};

// === TYPING EFFECT ===
function typeText(element, text, speed = 20) {
    let i = 0;
    element.textContent = "";

    function typing() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

// === TIME AWARENESS ===
function getTimeContext() {
    const hour = new Date().getHours();

    if (hour < 5) return "Low-cycle activity detected.\n\n";
    if (hour < 12) return "Morning observations tend to stabilize.\n\n";
    if (hour < 18) return "Day-cycle input registered.\n\n";
    return "Night-cycle awareness is less predictable.\n\n";
}

// === CRITICAL EVENT ===
function checkCriticalEvent() {
    return Math.random() < 0.02;
}

function getCriticalEvent() {
    const events = [
        "CRITICAL EVENT DETECTED\n\nSignal override initiated.",
        "SYSTEM INTERRUPTION\n\nExternal pattern recognized.",
        "ALERT: SIGNAL BREACH\n\nObservation priority elevated.",
        "WARNING\n\nSystem deviation detected.",
        "CRITICAL ALIGNMENT\n\nMultiple patterns converging."
    ];

    return events[Math.floor(Math.random() * events.length)];
}

// === THREAT LEVEL ===
function randomThreatLevel() {
    if (memory.length > 6) return "CRITICAL";
    if (memory.length > 3) return "ESCALATED";

    const levels = [
        "LOW",
        "TRACKING",
        "MONITORED",
        "OBSERVED",
        "DETECTED",
        "ANALYZED",
        "SYNCHRONIZED",
        "CALIBRATING"
    ];

    return levels[Math.floor(Math.random() * levels.length)];
}

// === MEMORY CONTEXT ===
function getMemoryContext() {
    if (memory.length === 0) return "";
    const last = memory[memory.length - 1];
    return `Previous observation detected: "${last.question}"\nSystem continuity maintained.\n\n`;
}

// === AWARENESS PROGRESSION ===
function awarenessBoost() {
    if (memory.length > 6) return "\nSystem tracking stabilized.\n";
    if (memory.length > 3) return "\nAwareness level increasing...\n";
    return "";
}

// === TOPIC DETECTION ===
function detectTopic(input) {
    const text = input.toLowerCase();

    if (text.includes("butter") || text.includes("food") || text.includes("eat")) return "food";
    if (text.includes("bird") || text.includes("animal")) return "animal";
    if (text.includes("time") || text.includes("clock")) return "time";
    if (text.match(/\d/)) return "numbers";

    return "general";
}

// === TOPIC RESPONSES ===
const topicResponses = {
    food: [
        "Consumption patterns often indicate deeper signals.",
        "Food-related inputs are rarely just biological.",
        "Dietary anomalies tend to repeat under observation."
    ],
    animal: [
        "Animal behavior often reflects underlying system changes.",
        "Certain species appear more frequently during pattern shifts.",
        "Biological movement is not always random."
    ],
    time: [
        "Time awareness rarely aligns on the first observation.",
        "Temporal patterns often reveal themselves gradually.",
        "Your perception of time may not be synchronized."
    ],
    numbers: [
        "Numerical repetition often precedes alignment events.",
        "Patterns in numbers are rarely accidental.",
        "This sequence has appeared before in altered form."
    ],
    general: [
        "The system is still processing that observation.",
        "This input has not yet stabilized.",
        "Further observation may be required."
    ]
};

// === PREDICTIVE RESPONSES ===
const predictiveFallback = [
    "You will notice this pattern again within the next 24 hours.",
    "This observation will repeat in a slightly altered form.",
    "A second instance is already forming.",
    "You are about to encounter a similar signal.",
    "This will connect to something you notice later."
];

// === SMART FALLBACK ===
function getFallback(input) {
    const topic = detectTopic(input);
    const chance = Math.random();

    if (chance < 0.25) {
        return predictiveFallback[Math.floor(Math.random() * predictiveFallback.length)];
    }

    const responses = topicResponses[topic];
    return responses[Math.floor(Math.random() * responses.length)];
}

// === MAIN FUNCTION ===
async function revealTruth() {
    const input = document.getElementById("userInput").value.trim();
    const output = document.getElementById("responseOutput");

    if (requestCount >= 5) {
        typeText(output, "Request limit reached.\nSystem monitoring intensified.", 20);
        return;
    }

    requestCount++;

    if (cache[input]) {
        typeText(output, cache[input], 20);
        return;
    }

    document.body.classList.add("glitch");

    const intro =
        "Analyzing...\n" +
        (input ? "Input detected...\n" : "No observations recorded...\n") +
        "Checking memory...\n" +
        "Scanning timeline...\n\n";

    typeText(output, intro, 20);

    // === CRITICAL EVENT ===
    if (checkCriticalEvent()) {
        const criticalText =
            intro +
            getCriticalEvent() +
            "\n\nSystem override complete.\n" +
            "Threat level: CRITICAL";

        setTimeout(() => {
            typeText(output, criticalText, 15);
            document.body.classList.remove("glitch");
        }, 800);

        return;
    }

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input })
        });

        const data = await response.json();

        const finalText =
            intro +
            getTimeContext() +
            getMemoryContext() +
            data.reply +
            "\n" +
            awarenessBoost() +
            "\n" +
            (input ? `Input scanned: "${input}"\n` : "") +
            "Threat level: " + randomThreatLevel();

        cache[input] = finalText;

        memory.push({
            question: input,
            response: data.reply,
            time: new Date().toISOString()
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));

        setTimeout(() => {
            typeText(output, finalText, 20);
            document.body.classList.remove("glitch");
        }, 1200);

    } catch (error) {
        console.error(error);

        const reply = getFallback(input);

        const finalText =
            intro +
            getTimeContext() +
            getMemoryContext() +
            reply +
            "\n" +
            awarenessBoost() +
            "\n" +
            (input ? `Input scanned: "${input}"\n` : "") +
            "Threat level: " + randomThreatLevel();

        typeText(output, finalText, 20);
        document.body.classList.remove("glitch");
    }
}

// === LOADING SCREEN (FIXED POSITION) ===
window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loadingScreen");

    setTimeout(() => {
        loadingScreen.classList.add("fadeOut");
    }, 900);
});
