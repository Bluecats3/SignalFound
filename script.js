console.log("SCRIPT LOADED");

// === MEMORY (PERSISTENT) ===
const STORAGE_KEY = "signalFound";
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

// === MEMORY CONTEXT ===
function getMemoryContext() {
    if (memory.length === 0) return "";

    const last = memory[memory.length - 1];
    return `Previous observation detected: "${last.question}"\nSystem continuity maintained.\n\n`;
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
                    history: memory
                })
            });

            const data = await response.json();
            const reply = data.reply || "Signal unclear.";

            document.body.classList.remove("glitch");

            const finalText =
                "SIGNAL ANALYSIS\n" +
                "INTERPRETATION\n\n" +
                getMemoryContext() +
                reply.replace(/\n/g, "\n\n");

            typeText(output, finalText, 20);

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
