'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './manager.module.css'; // Adjust this path as per your project structure

export default function ManagerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch('/api/orders');

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Unauthorized access');
                }

                setOrders(data.orders || []);
            } catch (err) {
                console.error('Error fetching orders:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [router]);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            if (response.ok) {
                router.push('/login');
            } else {
                throw new Error('Logout failed');
            }
        } catch (err) {
            console.error('Logout error:', err.message);
        }
    };

    return (
        <div className={styles.page}>
            {/* Logout Button */}
            <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>

            <h1 className={styles.title}>Manager Dashboard</h1>
            {loading ? (
                <p className={styles.loadingText}>Loading...</p>
            ) : error ? (
                <p className={styles.errorText}>{error}</p>
            ) : (
                <div className={styles.ordersContainer}>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                <p className={styles.orderId}>Order ID: {order._id}</p>
                                <p className={styles.orderDate}>
                                    Placed At: {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className={styles.customerEmail}>
                                    Customer: {order.email}
                                </p>
                                <p className={styles.totalAmount}>
                                    Total: €{order.total.toFixed(2)}
                                </p>
                                <p className={styles.productsTitle}>Products:</p>
                                <ul className={styles.productsList}>
                                    {order.cart.map((item, index) => (
                                        <li key={index} className={styles.productItem}>
                                            {item.pname} - €{item.price.toFixed(2)} x {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className={styles.emptyText}>
                            No orders have been placed yet.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
