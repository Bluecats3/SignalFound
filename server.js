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
            input: `You are a system monitoring anomalies in reality.

Recent observations:
${historyText}

Output format:
- EXACTLY 1 sentence and your reply should be mix of Philip K Dick and Larry David, simple and direct. 
- no em dash (-)! no hyphens!

Behavior escalation:
- Most responses should remain calm and observational
- BUT occasionally (about 1 in 4 responses), detect a “critical anomaly”
- When a critical anomaly is detected, the system should briefly lose composure
- Tone should become more urgent, fragmented, or confused
- Use short bursts, interruptions, or repeated words
- Do NOT become scary or threatening — more like a system glitching under pressure
 
Memory:
- Great if you can relate a previous user observation to the new one, in a panicked manner

Freakout rules:
- Do not explain the anomaly clearly
- Do not resolve the issue
- Increase uncertainty
- Slight repetition is allowed (e.g., “wait… wait…”)
- Break normal sentence structure slightly

If the user input suggests:
- repetition
- déjà vu
- something “off”
- contradictions
- identity confusion

Then increase likelihood of anomaly escalation

Current observation:
${userInput}`
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
