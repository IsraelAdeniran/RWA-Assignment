import connectToDatabase from '../../lib/mongodb';
import { getCustomSession } from '../../lib/session';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Retrieve the session
            const session = await getCustomSession(req, res);

            if (!session.user) {
                return res.status(401).json({ message: 'Unauthorized: No active session found' });
            }

            const { userId, email } = session.user;
            const { cart, total } = req.body;

            if (!cart || !total) {
                return res.status(400).json({ message: 'Cart and total are required' });
            }

            const db = await connectToDatabase();
            const ordersCollection = db.collection('orders');
            const cartCollection = db.collection('cart');

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
                await cartCollection.deleteMany({ userId });

                res.status(201).json({ message: 'Order placed successfully and cart cleared' });
            } else {
                res.status(500).json({ message: 'Failed to place order' });
            }
        } catch (error) {
            console.error('Error processing order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
