"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import styles from './login.module.css';
export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (prop) => (event) => {
        setCredentials({ ...credentials, [prop]: event.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                router.push(data.accountType === "manager" ? "/manager" : "/customer");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
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
                    {error && <Typography variant="body2" className={styles.message}>{error}</Typography>}
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
                    <Button type="submit" fullWidth variant="contained" className={styles.signUpButton}>
                        Log In
                    </Button>
                    <Typography textAlign="center" variant="body2" className={styles.signInText}>
                        Don’t have an account? <Link href="/register" underline="hover" className={styles.signInLink}>Register here</Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
