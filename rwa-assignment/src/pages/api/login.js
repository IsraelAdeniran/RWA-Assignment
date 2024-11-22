import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { email, password } = req.body;

    try {
        const db = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        const isPasswordCorrect = user.accountType === "manager" ?
            password === user.password :
            await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ success: true, token, accountType: user.accountType });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
