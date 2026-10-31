import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set. Add it to server/.env.");
    }

    const connectionInstance = await mongoose.connect(uri, { dbName: DB_NAME });
    console.log(`\n MongoDB Connected !! DB_Host: ${connectionInstance.connection.host}`);
    return connectionInstance;
};

export default connectDB;