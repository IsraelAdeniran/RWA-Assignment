import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
            const db = await connectToDatabase();
            const products = await db.collection('products').find({}).toArray();
            res.status(200).json(products);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
