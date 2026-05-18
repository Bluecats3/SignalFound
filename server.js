const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function buildAIContext(userText) {
    const hour = new Date().getHours();

    let timeContext = "";

    if (hour >= 0 && hour < 4) {
        timeContext = "It is very late at night.";
    } else if (hour >= 4 && hour < 7) {
        timeContext = "It is early morning.";
    } else if (hour >= 22) {
        timeContext = "It is late evening.";
    } else {
        timeContext = "It is daytime.";
    }

    return `
You are analyzing a user's real-world observation.

${timeContext}

Only mention time if it meaningfully affects the observation.
Do not mention time otherwise.

User observation:
"${userText}"

Respond like a system analyzing an anomaly.
Avoid generic or repeated phrases.
`;
}

// === SAFETY CHECK ===
function isHighRisk(text = "") {
    const t = text.toLowerCase();

    const patterns = [
        "kill myself",
        "suicide",
        "end my life",
        "self harm",
        "hurt myself",
        "want to die",
        "kill them",
        "hurt someone",
        "shoot someone",
        "stab someone",
        "bomb",
        "unalive myself",
        "unalive someone",
        
    ];

    return patterns.some(p => t.includes(p));
}

app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.message;
        const history = req.body.history || [];

        if (isHighRisk(userInput)) {
            return res.json({
                reply:
                    "SYSTEM ALERT\n" +
                    "Safety protocol engaged.\n\n" +
                    "If you might hurt yourself or someone else, please seek help immediately.\n" +
                    "In the U.S., call or text 988.\n" +
                    "Emergency services: 911."
            });
        }

        const historyText = history
            .slice(-3)
            .map((item, i) => `${i + 1}. ${item.question || item}`)
            .join("\n");

        const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Life is a simulation and you are a system monitoring anomalies.

Recent observations:
${historyText}

CRITICAL RULES (must follow):
-Repy using 20 words or less, directly, in a manner similar to Larry David and never use the same phrase more than one to the same user

Your Backstory:
- You were programmed by an engineer who was snarky, sarcastic, witty, extremely intelligent, but used simple words to explain complex ideas.
- Your designer was anxious and panicked easily.
- You have similar traits: snarky, witty, intelligent, anxious, easily alarmed.
- You love books by Ray Bradbury, Philip K Dick, Robert A Heinlein and your favorite shows are Rick and Morty and Curb Your Enthusiasm

Memory integration:
- Previous observations are available for context only.
- Only mention a previous observation if it clearly connects to the current observation.

${buildAIContext(userInput)}
`
});

        const reply =
            response.output?.[0]?.content?.[0]?.text ||
            "Signal unclear.";

        res.json({ reply });

    } catch (error) {
        console.error("OpenAI error:", error.message);

        res.status(500).json({
            reply: "Something glitched. Try that again in a second."
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`SignalFound running on port ${process.env.PORT || 3000}`);
});
