const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

const PORT = 5000;

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

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();