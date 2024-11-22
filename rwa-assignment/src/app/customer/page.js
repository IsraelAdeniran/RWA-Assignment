'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Box, Typography, Button, Card, CardMedia,CardContent, CardActions, Grid, Snackbar, Alert} from '@mui/material';
import styles from './customer.module.css';

export default function CustomerPage() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [weather, setWeather] = useState(null);
    const [view, setView] = useState('products');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/getProducts');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Fetch weather data
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    'http://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch weather');
                }
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error('Error fetching weather:', error);
            }
        };

        fetchWeather();
    }, []);

    // Fetch user orders
    useEffect(() => {
        if (view === 'orders') {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('User is not logged in.');
                    }

                    const response = await fetch('/api/orders', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }

                    const data = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    setError(error.message);
                }
            };

            fetchOrders();
        }
    }, [view]);

    const handleAddToCart = async (product) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product._id,
                    pname: product.pname,
                    price: product.price,
                    quantity: 1,
                }),
            });
            if (response.ok) {
                setNotification({ open: true, message: `${product.pname} added to cart`, severity: 'success' });
            } else {
                setNotification({ open: true, message: 'Failed to add product to cart', severity: 'error' });
            }
        } catch (error) {
            setNotification({ open: true, message: 'Error adding to cart', severity: 'error' });
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <Box className={styles.page}>
            {/* Weather Information */}
            {weather && (
                <Box className={styles.weather}>
                    Weather in {weather.location.name}: {weather.current.temp_c}°C, {weather.current.condition.text}
                </Box>
            )}

            {/* Toggle View Buttons */}
            <Box className={styles.toggleButtons}>
                <Button
                    variant="contained"
                    color={view === 'products' ? 'success' : 'primary'}
                    onClick={() => setView('products')}
                >
                    Products
                </Button>
                <Button
                    variant="contained"
                    color={view === 'orders' ? 'success' : 'primary'}
                    onClick={() => setView('orders')}
                >
                    View Orders
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.push('/view_cart')}
                >
                    View Cart
                </Button>
            </Box>

            {/* Content Sections */}
            {view === 'products' ? (
                <Box className={styles.container}>
                    <Typography variant="h4" gutterBottom className={styles.sectionTitle}>
                        Products
                    </Typography>

                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <Card className={styles.productCard}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.image || '/placeholder.png'}
                                        alt={product.pname}
                                        className={styles.productImage}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" className={styles.productName}>
                                            {product.pname}
                                        </Typography>
                                        <Typography variant="body2" className={styles.productDescription}>
                                            {product.description || 'No description available'}
                                        </Typography>
                                        <Typography variant="body1" className={styles.productPrice}>
                                            €{product.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            className={styles.addToCart}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Box className={styles.orderContainer}>
                    <Typography variant="h4" gutterBottom className={styles.sectionTitle}>
                        Your Orders
                    </Typography>
                    {error ? (
                        <Typography className={styles.errorMessage}>{error}</Typography>
                    ) : (
                        <Box>
                            {orders.map((order) => (
                                <Box key={order._id} className={styles.orderCard}>
                                    <Typography className={styles.orderDetails}>
                                        Order Placed: {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Box>
                                        {order.cart.map((item, index) => (
                                            <Box key={index} className={styles.orderItem}>
                                                <span className={styles.itemName}>{item.pname}</span>
                                                <span className={styles.itemPrice}>
                                                    €{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Typography className={styles.orderTotal}>
                                        Total: €{order.total.toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Snackbar Notification */}
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
