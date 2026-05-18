console.log("SCRIPT LOADED");

// === MEMORY (PERSISTENT) ===
const STORAGE_KEY = "signalFound_v2";
let memory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// === TYPING EFFECT ===
function typeText(element, text, speed = 20) {
    let i = 0;

    if (element.tagName === "TEXTAREA") {
        element.value = "";
    } else {
        element.textContent = "";
    }

    function typing() {
        if (i < text.length) {
            if (element.tagName === "TEXTAREA") {
                element.value += text[i];
            } else {
                element.textContent += text[i];
            }

            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

// === CATEGORY DETECTION ===
function categorizeObservation(text) {
    const lower = text.toLowerCase();

    if (lower.includes("dream") || lower.includes("sleep")) {
        return "Sleep-state anomaly";
    }

    if (lower.includes("deja vu") || lower.includes("again")) {
        return "Memory loop";
    }

    if (
        lower.includes("phone") ||
        lower.includes("screen") ||
        lower.includes("internet") ||
        lower.includes("computer")
    ) {
        return "Technology signal";
    }

    if (
        lower.includes("person") ||
        lower.includes("people") ||
        lower.includes("stranger") ||
        lower.includes("someone")
    ) {
        return "Social pattern";
    }

    if (
        lower.includes("weird") ||
        lower.includes("strange") ||
        lower.includes("off") ||
        lower.includes("glitch")
    ) {
        return "Reality distortion";
    }

    return "Unclassified observation";
}

// === OBSERVATION INTRO ===
function getObservationIntro(userText) {
    const category = categorizeObservation(userText);

    return `
        Observation received.<br>
        Analyzing pattern...<br>
        Category: <strong>${category}</strong>.<br><br>
    `;
}

// === MAIN FUNCTION ===
async function revealTruth() {
    const inputBox = document.getElementById("userInput");
    const output = document.getElementById("responseOutput");

    if (inputBox.dataset.system === "true") {
        inputBox.value = "";
        inputBox.dataset.system = "false";
        return;
    }

    const input = inputBox.value.trim();

    if (!input) return;

    document.body.classList.add("glitch");

    const intro =
        "Observation received...\n" +
        "Logging anomaly...\n" +
        "Classifying signal...\n" +
        "Preparing interpretation...\n\n";

    typeText(output, intro, 20);

    setTimeout(async () => {
        try {
            const response = await fetch("/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    history: memory.slice(-3)
                })
            });

            const data = await response.json();
            const reply = data.reply || "Signal unclear.";

            document.body.classList.remove("glitch");

            const finalText =
                '<span style="color:#ff2e2e">SIGNAL ANALYSIS<br>INTERPRETATION:</span><br><br>' +
                getObservationIntro(input) +
                reply.replace(/\n/g, "<br><br>");

            output.innerHTML = finalText;

            const brainSignal = document.getElementById("brainSignal");
            if (brainSignal) {
                brainSignal.classList.add("showBrain");
            }

            memory.push({
                question: input,
                response: reply,
                time: new Date().toISOString()
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));

        } catch (error) {
            console.error(error);
            document.body.classList.remove("glitch");
            typeText(output, "SIGNAL ERROR\nNO RESPONSE RECEIVED", 20);
        }
    }, 1200);
}

// === LOADING SCREEN ===
window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const output = document.getElementById("responseOutput");
    const inputBox = document.getElementById("userInput");

    setTimeout(() => {
        loadingScreen.classList.add("fadeOut");

        setTimeout(() => {
            loadingScreen.style.display = "none";

            const standbyMessages = [
                "SYSTEM STANDBY\nAwaiting observation...",
                "SYSTEM IDLE\nNo anomalies detected.",
                "MONITORING ACTIVE\nAwaiting input..."
            ];

            const randomMsg =
                standbyMessages[Math.floor(Math.random() * standbyMessages.length)];

            typeText(output, randomMsg, 30);

            inputBox.dataset.system = "true";
            typeText(inputBox, "Enter observation...", 40);

        }, 500);
    }, 900);

    inputBox.addEventListener("focus", clearSystemText);
    inputBox.addEventListener("click", clearSystemText);
    inputBox.addEventListener("touchstart", clearSystemText);
});

// === CLEAR PLACEHOLDER TEXT ===
function clearSystemText() {
    const inputBox = document.getElementById("userInput");

    if (inputBox.dataset.system === "true") {
        inputBox.value = "";
        inputBox.dataset.system = "false";
    }
}
