import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { firstName, lastName, username, email, password, accountType } = req.body;

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        // Check if email or username already exists
        if (await usersCollection.findOne({ $or: [{ email }, { username }] })) {
            return res.status(400).json({ message: "Email or username already registered" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            accountType,
            createdAt: new Date(),
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
