import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from 'mongodb';
import emailValidator from 'email-validator';


const sanitizeInput = (input) => {
    return input.replace(/[<>;'"/]/g, '')
};

export default async function handler(req, res) {
    const { firstName, lastName, username, email, password, accountType } = req.body;

    // Sanitize input to prevent injection
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // Validate email format using email-validator
    if (!emailValidator.validate(sanitizedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Limit the length of inputs (server-side validation)
    if (sanitizedFirstName.length > 50 || sanitizedLastName.length > 50 || sanitizedUsername.length > 30 || sanitizedEmail.length > 100 || sanitizedPassword.length > 60) {
        return res.status(400).json({ message: "Input exceeds maximum length." });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if email or username already exists
    const existingUser = await usersCollection.findOne({ $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }] });
    if (existingUser) {
        return res.status(400).json({ message: "Email or username already registered" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const userId = new ObjectId();

    await usersCollection.insertOne({
        _id: userId,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        username: sanitizedUsername,
        email: sanitizedEmail,
        password: hashedPassword,
        accountType: accountType || "customer",
        createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully", userId: userId.toString() });
}
