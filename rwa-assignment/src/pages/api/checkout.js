import connectToDatabase from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { userId, email } = decoded;

            const { cart, total } = req.body;

            if (!cart || !total) {
                return res.status(400).json({ message: 'Cart and total are required' });
            }

            const db = await connectToDatabase();
            const ordersCollection = db.collection('orders');

            // Create the order associated with the userId
            const order = {
                userId,
                email,
                cart,
                total,
                createdAt: new Date(),
            };

            const result = await ordersCollection.insertOne(order);

            if (result.acknowledged) {
                res.status(201).json({ message: 'Order placed successfully' });
            } else {
                res.status(500).json({ message: 'Failed to place order' });
            }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
