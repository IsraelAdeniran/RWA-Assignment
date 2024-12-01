'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Grid, Snackbar, Alert } from '@mui/material';
import styles from './customer.module.css';

export default function CustomerPage() {
    const [products, setProducts] = useState([]);
    const [weather, setWeather] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/checkSession');
                if (!response.ok) {
                    throw new Error('Session invalid');
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkSession();
    }, [router]);

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

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    'https://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no'
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

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            if (response.ok) {
                router.push('/login');
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <Box className={styles.page}>
            {/* Logout Button */}
            <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            >
                Logout
            </Button>

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
                    color="secondary"
                    onClick={() => router.push('/view_cart')}
                >
                    View Cart
                </Button>
            </Box>

            {/* Products Section */}
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
