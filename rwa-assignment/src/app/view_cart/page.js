'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import styles from './view_cart.module.css';

export default function ViewCart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Fetch the cart data using session-based API
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/cart'); // No need for Authorization header
                if (response.status === 401) throw new Error('Unauthorized: Please log in.');
                if (!response.ok) throw new Error(`Error: ${response.status}`);

                setCart(await response.json());
            } catch (error) {
                setNotification({ open: true, message: error.message, severity: 'error' });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (!response.ok) throw new Error('Failed to remove item');

            setNotification({ open: true, message: 'Item removed', severity: 'success' });
            setCart((prev) => prev.filter((item) => item.productId !== productId));
        } catch (error) {
            setNotification({ open: true, message: error.message, severity: 'error' });
        }
    };

    const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleCheckout = () => {
        cart.length
            ? (window.location.href = '/checkout')
            : setNotification({ open: true, message: 'Cart is empty', severity: 'warning' });
    };

    return (
        <Box className={styles.page}>
            <Typography className={styles.cartTitle}>Your Cart</Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : cart.length === 0 ? (
                <Typography>Your cart is empty.</Typography>
            ) : (
                <Box>
                    <Box className={styles.cartContainer}>
                        {cart.map(({ productId, pname, price, quantity }) => (
                            <Box key={productId} className={styles.cartItem}>
                                <Typography>{pname}</Typography>
                                <Typography>Price: €{price.toFixed(2)}</Typography>
                                <Typography>Quantity: {quantity}</Typography>
                                <Button onClick={() => handleRemoveFromCart(productId)}>Remove</Button>
                            </Box>
                        ))}
                    </Box>
                    <Box>
                        <Typography>Total: €{calculateTotal()}</Typography>
                        <Button variant="contained" color="success" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </Box>
                </Box>
            )}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
