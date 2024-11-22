import { MongoClient } from "mongodb";

let client;
let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            if (!client) {

                client = new MongoClient(process.env.DB_URI);
            }
            await client.connect();
            dbConnection = client.db("RichWeb");
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
