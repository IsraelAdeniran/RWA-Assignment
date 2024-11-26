'use client';

import { useState, useEffect } from 'react';
import styles from './checkout.module.css';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('/api/cart');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCart(data);

                // Calculate the total
                const totalAmount = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
                setTotal(totalAmount);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setError('Failed to load cart items.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Handle order confirmation
    const handleConfirmOrder = async () => {
        setError('');
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You must be logged in to place an order.');
                return;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cart, total }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order');
            }

            const result = await response.json();
            setSuccessMessage(result.message);

            // Optionally clear the cart after successful order
            setCart([]);
            setTotal(0);
        } catch (error) {
            console.error('Error placing order:', error);
            setError(error.message);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.header}>Checkout</h1>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : (
                <>
                    <div className={styles.orderSummary}>
                        {cart.map((item) => (
                            <div key={item.productId} className={styles.item}>
                                <span className={styles.itemName}>{item.pname}</span>
                                <span className={styles.itemPrice}>
                                €{(item.price * item.quantity).toFixed(2)}
                            </span>
                            </div>
                        ))}
                        <div className={styles.total}>Total: €{total.toFixed(2)}</div>
                    </div>

                    <button className={styles.checkoutButton} onClick={handleConfirmOrder}>
                        Confirm Order
                    </button>
                </>
            )}

            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
    );
}
