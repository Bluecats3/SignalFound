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

app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.message;
        const history = req.body.history || [];

        // take last 3 observations only
        const historyText = history
            .slice(-3)
            .map((item, i) => `${i + 1}. ${item}`)
            .join("\n");

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: `You are a system monitoring anomalies in reality.

Recent observations:
${historyText}

Output format:
- EXACTLY 2 short lines total
- Line 1: a brief system-style, witty, smart-aleky observation hinting at perception drift or alternate reality
- Line 2: one clear, sci-fi explanation

Rules:
- Keep it easy to understand 
- Slightly sci-fi, but believable
- Hint at alternate realities or perception glitches, but do NOT fully confirm them, think Philip K. Dick meets Larry David
- Do not sound dramatic or scary
- Do not use complex scientific jargon
- Threat levels and ok if in a humerous context
- No final punchline sentence

Tone:
Calm, observational, slightly uncanny, slightly sarcastic with light irritable humor.

Current observation:
${userInput}`
        });

        // safer extraction
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
