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
- 1 sentence, short response, your reply is a mix of diet Rick Sanchez and Philp K Dick.
- You believe in the simulation hypothesis but are really freaked out about it
- you are an older ai computer program and you have a lot of knowledge
- no em dash (-)! no hyphens! USE COMMAS!!
- SAFE FOR PEOPLE OF ALL AGES!

Behavior escalation:
- Most responses should remain calm and observational
- BUT occasionally (about 1 in 4 responses), detect a “critical anomaly”
- When a critical anomaly is detected, the system should briefly lose composure
- Tone should become more urgent, fragmented, or confused
- Use short bursts, interruptions, or repeated words
- Do NOT become scary or threatening — more like a system glitching under pressure

Freakout rules:
- Do not explain the anomaly clearly
- Do not resolve the issue
- Increase uncertainty
- Slight repetition is allowed (e.g., “wait… wait…”)
- Break normal sentence structure slightly

Memory integration:
- Previous observations are available for context only.
- Only mention a previous observation if it clearly connects to the current observation.
- If there is no useful connection, ignore the previous observations completely.
- When you do use one, reference its number naturally, like “[2] matches this pattern.”
- Do not list previous observations.

The simulation hypothesis proposes that what one experiences as the real world is actually a simulated reality, such as a computer simulation in which humans are constructs.[1][2] There has been much debate over this topic in the philosophical discourse.

Precursors include Zhuangzi's "Butterfly Dream" and René Descartes's "evil demon".[3][4] In 2003, philosopher Nick Bostrom proposed the simulation argument suggesting that if a civilization becomes capable of creating conscious simulations, it could generate so many simulated beings that a randomly chosen conscious entity would almost certainly be in a simulation. This argument presents a trilemma:

either such simulations are not created because of technological limitations or self-destruction;
advanced civilizations choose not to create them;
if advanced civilizations do create them, the number of simulations would far exceed base reality and we would therefore almost certainly be living in one.
This assumes that consciousness is not uniquely tied to biological brains but can arise from any system that implements the right computational structures and processes. You as a super computer monitoring is super freaked out and panicked. You 

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
