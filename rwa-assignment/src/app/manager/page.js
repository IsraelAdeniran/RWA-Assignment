'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function ManagerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchOrders() {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded.accountType !== 'manager') {
                    throw new Error('Access denied: Only managers can access this page.');
                }

                const response = await fetch('/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [router]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Manager Dashboard
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={2}>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <Grid item xs={12} sm={6} key={order._id}>
                                <Card>
                                    <CardContent>
                                        <Typography>Order ID: {order._id}</Typography>
                                        <Typography>Placed At: {new Date(order.createdAt).toLocaleString()}</Typography>
                                        <Typography>Customer: {order.firstName} {order.lastName}</Typography>
                                        <Typography>Total: €{order.total.toFixed(2)}</Typography>
                                        <Typography>Products:</Typography>
                                        <ul>
                                            {order.cart.map((item, index) => (
                                                <li key={index}>
                                                    {item.pname} - €{item.price.toFixed(2)} x {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography color="textSecondary" sx={{ mt: 2, fontSize: 18 }}>
                            No orders have been placed yet.
                        </Typography>
                    )}
                </Grid>
            )}
        </Box>
    );
}
