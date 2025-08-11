// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import airoutes from "./airoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", airoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@first-try-mongodb-atlas.3vtotij.mongodb.net/?retryWrites=true&w=majority&appName=First-Try-Mongodb-Atlas-Cluster1`;

// MongoDB setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const capstoneDatabase = client.db("capstoneDB");
const chatsCollection = capstoneDatabase.collection("chatCOL");

async function run() {
  try {
    await client.connect();

    app.get("/hi", (req, res) => {
      res.send("hello from app.get!");
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

export { client, chatsCollection };
