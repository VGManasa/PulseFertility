
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

const PORT = 5000;

// Allow Express to read JSON requests
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully!");

        // Select database
        const db = client.db("GAMMA");

        // Select collection
        const testCollection = db.collection("test");

        // Home route
        app.get("/", (req, res) => {
            res.send("GAMMA server is running!");
        });

        // MongoDB test route
        app.get("/test", async (req, res) => {
            try {
                const result = await testCollection.insertOne({
                    message: "GAMMA MongoDB test successful!",
                    createdAt: new Date()
                });

                res.json({
                    success: true,
                    message: "Data inserted into MongoDB!",
                    id: result.insertedId
                });

            } catch (error) {
                console.error(error);

                res.status(500).json({
                    success: false,
                    message: "Failed to insert data"
                });
            }
        });

        // ==========================================
        // WHATSAPP WEBHOOK VERIFICATION
        // ==========================================

        app.get("/webhook", (req, res) => {

            const mode = req.query["hub.mode"];
            const token = req.query["hub.verify_token"];
            const challenge = req.query["hub.challenge"];

            if (
                mode === "subscribe" &&
                token === process.env.WHATSAPP_VERIFY_TOKEN
            ) {
                console.log("WhatsApp webhook verified successfully!");

                res.status(200).send(challenge);
            } else {
                console.log("WhatsApp webhook verification failed!");

                res.sendStatus(403);
            }
        });

        // ==========================================
        // WHATSAPP INCOMING MESSAGES
        // ==========================================

        app.post("/webhook", async (req, res) => {

            console.log("WhatsApp webhook received!");

            console.log(
                JSON.stringify(req.body, null, 2)
            );

            // Immediately tell Meta we received the message
            res.sendStatus(200);

            // We will add message processing here later.
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();

