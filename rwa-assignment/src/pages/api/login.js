import connectToDatabase from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { getCustomSession } from "../../lib/session";

export default async function handler(req, res) {

    const { email, password } = req.body;
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
    }

    let isPasswordCorrect;

    if (user.accountType === "manager") {
        // For managers, check the password directly
        isPasswordCorrect = password === user.password;
    } else {
        // For customers, compare the hashed password
        isPasswordCorrect = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordCorrect) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
    }

    // Save user data to session
    const session = await getCustomSession(req, res);
    session.user = { id: user._id.toString(), email: user.email, accountType: user.accountType };
    await session.save();

    res.status(200).json({ success: true, accountType: user.accountType });
}
