import connectToDatabase from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { userId, accountType } = decoded;

            const db = await connectToDatabase();
            const ordersCollection = db.collection('orders');

            let orders;

            if (accountType === 'manager') {
                // Fetch all orders for a manager
                orders = await ordersCollection.find().toArray();
            } else if (accountType === 'customer') {
                // Fetch orders specific to the userId
                orders = await ordersCollection.find({ userId }).toArray();
            } else {
                return res.status(403).json({ message: 'Access denied: Invalid account type' });
            }

            res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
            res.status(401).json({ message: 'Unauthorized: Invalid or malformed token' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
