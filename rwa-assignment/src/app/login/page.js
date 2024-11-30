'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box, Link, CircularProgress } from '@mui/material';
import styles from './login.module.css';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (prop) => (event) => {
        setCredentials({ ...credentials, [prop]: event.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            console.log('API Response:', data); // Debug API response

            if (response.ok && data.success) {
                console.log('Navigating to:', data.accountType === 'manager' ? '/manager' : '/customer');
                // Navigate to the appropriate page
                router.push(data.accountType === 'manager' ? '/manager' : '/customer');
            } else {
                console.error('Login failed:', data.message || 'Unknown error');
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.leftPanel}>
                <Typography variant="h4" className={styles.brandTitle}>Login Page</Typography>
                <Typography variant="h6" className={styles.description}>Welcome to the Login Page!</Typography>
            </Box>
            <Box className={styles.rightPanel} component="form" onSubmit={handleLogin}>
                <Box className={styles.formContainer}>
                    <Typography variant="h5" className={styles.header}>Login</Typography>
                    {error && <Typography variant="body2" className={styles.message} color="error">{error}</Typography>}
                    <TextField
                        fullWidth
                        label="Email"
                        required
                        value={credentials.email}
                        onChange={handleChange('email')}
                        margin="normal"
                        className={styles.inputField}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        required
                        value={credentials.password}
                        onChange={handleChange('password')}
                        margin="normal"
                        className={styles.inputField}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={styles.signUpButton}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>
                    <Typography textAlign="center" variant="body2" className={styles.signInText}>
                        Don’t have an account?{' '}
                        <Link href="/register" underline="hover" className={styles.signInLink}>
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
