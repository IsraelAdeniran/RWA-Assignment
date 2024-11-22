import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const products = await db.collection('products').find({}).toArray();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
