import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { getCustomSession } from "../../lib/session";
import emailValidator from "email-validator";

const sanitizeInput = (input) => {
    if (typeof input !== "string") return "";
    return input
        .replace(/[\u0000<>;'"/\\]/g, "")
        .replace(/[\r\n]/g, "")
        .trim();
};

export default async function handler(req, res) {
    try {
        // Sanitize inputs
        const rawEmail = req.body.email || "";
        const rawPassword = req.body.password || "";
        const email = sanitizeInput(rawEmail);
        const password = sanitizeInput(rawPassword);

        // Validate email format
        if (!emailValidator.validate(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        const db = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        // If user is not found
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        let isPasswordCorrect = false;

        if (user.accountType === "manager") {
            // For managers, check the password directly
            isPasswordCorrect = password === user.password;
        } else {
            // For customers, compare the hashed password
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        }

        // If password is incorrect
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // Save user data to session
        const session = await getCustomSession(req, res);
        session.user = { id: user._id.toString(), email: user.email, accountType: user.accountType };
        await session.save();

        return res.status(200).json({ success: true, accountType: user.accountType });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
