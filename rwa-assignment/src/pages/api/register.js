import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

        const { firstName, lastName, username, email, password, accountType } = req.body;

        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        // Check if email or username already exists
        if (await usersCollection.findOne({ $or: [{ email }, { username }] })) {
            return res.status(400).json({ message: "Email or username already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = new ObjectId();

        await usersCollection.insertOne({
            _id: userId,
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            accountType: "customer",
            createdAt: new Date(),
        });
        res.status(201).json({ message: "User registered successfully", userId: userId.toString() });
}
