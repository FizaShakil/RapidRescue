import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle unexpected server-level errors after startup
        server.on("error", (err) => {
            console.error("Server error:", err.message);
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });
