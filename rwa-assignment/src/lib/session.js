import { getIronSession } from "iron-session";

export async function getCustomSession(req, res) {
    console.log("loading session stuff");

    const password = "VIi8pH38vD8ZLgEZclSa7an3olx4pkh6pvBj9fGZf";

    const session = await getIronSession(req, res, {
        password,
        cookieName: "app_session",
        cookieOptions: {
            secure: false,
            httpOnly: true,
            sameSite: "strict",
        },
    });

    return session;
}
