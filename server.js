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
- EXACTLY 2 short lines total

Line 1:
- A short system-style observation
- Use varied wording each time
- Avoid repeating phrases from previous responses
- Do NOT use the repeat the phrase "alternate reality" to the same user
- Prefer subtle wording like pattern mismatch, misalignment, or inconsistency

Line 2:
- A clear, simple explanation of the observation
- Easy to understand, slightly dry or ironic

Style:
- Calm, observational, slightly uncanny and dry wit
- Light sarcastic or dry humor allowed
- Do not sound dramatic or alarming
- No complex scientific jargon

Memory:
- Only reference previous observations when it feels natural
- Do NOT always mention them

Hard rules:
- No repeated phrases like "system continuity maintained"
- No overused sci-fi clichés
- No punchline endings
- Each response should feel slightly different in wording and structure.
- No em dash (-) or hypens (-)

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
