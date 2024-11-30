import { getCustomSession } from '../../lib/session';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Retrieve session using your custom function
        const session = await getCustomSession(req, res);

        // Validate session and manager access
        if (!session?.user || session.user.accountType !== 'manager') {
            return res.status(401).json({ message: 'Unauthorized: Only managers can access this page.' });
        }

        // Fetch orders from the database
        const db = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const orders = await ordersCollection.find().toArray();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
