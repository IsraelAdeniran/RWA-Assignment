import { MongoClient } from 'mongodb';

let client;
let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            const uri = process.env.MONGODB_URI;
            if (!uri) {
                throw new Error("MongoDB URI is not set in environment");
            }
            if (!client) {
                client = new MongoClient(uri);
            }
            await client.connect();
            dbConnection = client.db("RichWeb");  // Ensure this matches your actual DB name
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
