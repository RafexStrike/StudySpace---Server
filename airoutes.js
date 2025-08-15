// aiRoutes.js
import express from "express";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const router = express.Router();
console.log("hello from aiRoutes.js!");
console.log("HF_TOKEN:", process.env.HF_TOKEN ? "Loaded" : "Missing");

const client = new InferenceClient(process.env.HF_TOKEN);

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    let out = "";

    // Use Hermes-3 Llama-3.1 8B in streaming mode
    const stream = client.chatCompletionStream({
      provider: "auto",
      model: "NousResearch/Hermes-3-Llama-3.1-8B",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        out += chunk.choices[0].delta.content || "";
      }
    }

    // Send the full response after streaming completes
    res.json({ reply: out });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to get AI response",
        details: error.message,
      });
    }
  }
});

export default router;
