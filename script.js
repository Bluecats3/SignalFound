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


function getTimeContext() {
    const hour = new Date().getHours();

    const lines = {
        late: [
            "Low-cycle activity detected.",
            "Sleep-window instability noted.",
            "Late-hour perception drift possible."
        ],
        morning: [
            "Morning-cycle input registered.",
            "Daylight calibration active.",
            "Early-cycle pattern scan complete."
        ],
        day: [
            "Day-cycle input registered.",
            "Ambient reality conditions stable.",
            "Standard waking-hour scan active."
        ],
        night: [
            "Night-cycle awareness active.",
            "Low-light interpretation variance noted.",
            "Evening-cycle pattern monitoring enabled."
        ]
    };

    let group;

    if (hour < 5) group = lines.late;
    else if (hour < 12) group = lines.morning;
    else if (hour < 18) group = lines.day;
    else group = lines.night;

    return group[Math.floor(Math.random() * group.length)] + "\n";
}



// === MEMORY CONTEXT ===
function getMemoryContext() {
    if (memory.length === 0) return "";

    const recent = memory.slice(-3); // last 3 observations

    const memoryLines = [
        "Memory chain active.",
        "Prior signals detected.",
        "Pattern history available.",
        "Context fragments restored."
    ];

    const randomLine =
        memoryLines[Math.floor(Math.random() * memoryLines.length)];

    const numbered = recent
    .map((item, index) => `[${index + 1}] "${item.question}"`)
    .join("<br>");

    return `${randomLine}<br>${numbered}<br><br>`;
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
    "Analyzing...\n" +
    "Input detected...\n" +
    "Checking memory...\n" +
    "Scanning timeline...\n\n";

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
    getTimeContext().replace(/\n/g, "<br>") +
    getMemoryContext() +
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

            // Bottom box standby
            const standbyMessages = [
                "SYSTEM STANDBY\nAwaiting observation...",
                "SYSTEM IDLE\nNo anomalies detected.",
                "MONITORING ACTIVE\nAwaiting input..."
            ];

            const randomMsg =
                standbyMessages[Math.floor(Math.random() * standbyMessages.length)];

            typeText(output, randomMsg, 30);

            // 🔥 Top input typing
            inputBox.dataset.system = "true";
            typeText(inputBox, "Enter observation...", 40);

        }, 500);
    }, 900);

    // 🔥 ADD YOUR LISTENERS HERE
    inputBox.addEventListener("focus", clearSystemText);
    inputBox.addEventListener("click", clearSystemText);
    inputBox.addEventListener("touchstart", clearSystemText);
});

function clearSystemText() {
    const inputBox = document.getElementById("userInput");

    if (inputBox.dataset.system === "true") {
        inputBox.value = "";
        inputBox.dataset.system = "false";
    }
}
