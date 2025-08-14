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
// router.post("/chat", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required" });
//   }

//   try {
//     res.setHeader("Content-Type", "text/plain; charset=utf-8");
//     res.setHeader("Transfer-Encoding", "chunked");

//     let out = "";

//     const stream = client.chatCompletionStream({
//       provider: "auto",
//       model: "mistralai/Mistral-7B-Instruct-v0.2",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     for await (const chunk of stream) {
//       if (chunk.choices && chunk.choices.length > 0) {
//         const newContent = chunk.choices[0].delta.content || "";
//         out += newContent;
//         res.write(newContent);
//       }
//     }

//     res.end();
//   } catch (error) {
//     console.error("Error in /api/chat:", error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         error: "Failed to get AI response",
//         details: error.message,
//       });
//     }
//   }
// });

// POST /api/chat

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    let out = "";

    const stream = client.chatCompletionStream({
      provider: "auto",
      model: "mistralai/Mistral-7B-Instruct-v0.2",
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

    // Send JSON after streaming is done
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
