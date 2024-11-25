import connectToDatabase from '../../../../../RWA-Project/rwa-project/src/lib/mongodb';

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();

        if (req.method === 'GET') {
            // Fetch all items from the cart collection
            const cartItems = await db.collection('cart').find().toArray();
            res.status(200).json(cartItems);
        } else if (req.method === 'POST') {
            // Add item to the cart
            const { productId, pname, price, quantity } = req.body;
            if (!productId || !pname || !price || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            await db.collection('cart').insertOne({ productId, pname, price, quantity });
            res.status(201).json({ message: 'Item added to cart' });
        } else if (req.method === 'DELETE') {
            const { productId } = req.body;

            if (productId) {
                // Remove a specific item from the cart
                const result = await db.collection('cart').deleteOne({ productId });
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Item removed from cart' });
                } else {
                    res.status(404).json({ message: 'Item not found in cart' });
                }
            } else {
                // Clear the entire cart if no productId is provided
                await db.collection('cart').deleteMany({});
                res.status(200).json({ message: 'Cart cleared' });
            }
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
