const {
  setDatabase
} = require("./role3/services/workflowService");

const {
  handleWorkflowEvent,
  handlePatientStatus
} = require("./role3/controllers/workflowController");

const dns = require("dns");

// Force Node.js to use public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());


// ===============================
// CHECK MONGODB URI
// ===============================

if (!process.env.MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is missing from .env");
    process.exit(1);
}

console.log("MongoDB URI loaded successfully.");

const client = new MongoClient(process.env.MONGODB_URI);


// ===============================
// START SERVER
// ===============================

async function startServer() {

    try {

        console.log("Connecting to MongoDB...");

        await client.connect();

        console.log("MongoDB connected successfully!");


        // ===============================
        // MONGODB DATABASE
        // ===============================

        const db = client.db("PulseFertility");

        // Give Role 3 access to MongoDB
        setDatabase(db);

        const testCollection = db.collection("test");


        // ===============================
        // HOME ROUTE
        // ===============================

        app.get("/", (req, res) => {
            res.send("GAMMA server is running!");
        });


        // ===============================
        // MONGODB TEST ROUTE
        // ===============================

        app.get("/test", async (req, res) => {

            try {

                const result = await testCollection.insertOne({
                    message: "GAMMA MongoDB test successful!",
                    createdAt: new Date()
                });

                console.log("Document inserted:", result.insertedId);

                res.json({
                    success: true,
                    message: "Data inserted into MongoDB!",
                    id: result.insertedId
                });

            } catch (error) {

                console.error("MongoDB insert error:", error);

                res.status(500).json({
                    success: false,
                    message: "Failed to insert data"
                });

            }

        });


        // ===============================
        // ROLE 3 WORKFLOW ROUTES
        // ===============================

        app.post(
            "/api/role3/workflow",
            handleWorkflowEvent
        );

        app.post(
            "/api/role3/patient-status",
            handlePatientStatus
        );


        // ===============================
        // START EXPRESS SERVER
        // ===============================

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error("MongoDB connection failed!");
        console.error(error);

        process.exit(1);

    }

}

startServer();