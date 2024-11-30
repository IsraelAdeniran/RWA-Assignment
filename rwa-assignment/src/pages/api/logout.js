import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    const session = await getCustomSession(req, res);
    session.destroy(); // Clear the session
    res.status(200).json({ message: 'Logged out successfully' });
}
