import { MongoClient } from "mongodb";
let client;
let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            if (!client) {
                client = new MongoClient("mongodb+srv://b00157067:eF7U1qIh5nKLRr1d@cluster1.x3zhu.mongodb.net/RichWeb?retryWrites=true&w=majority&appName=Cluster1");
            }
            await client.connect();
            dbConnection = client.db("RichWeb");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
