"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Checkbox, Link } from "@mui/material";
import styles from "./register.module.css";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, username, email, password }),
            });
            const data = await response.json();
            if (data.success) {
                router.push("/login");
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <Typography variant="h4" className={styles.brandTitle}>Register Page</Typography>
                <Typography variant="h6" className={styles.description}>
                    Please enter your registration details.
                </Typography>
            </div>

            <div className={styles.rightPanel}>
                <Box className={styles.formContainer}>
                    <Typography variant="h5" className={styles.header}>Registration</Typography>
                    <Typography variant="body2" className={styles.subHeader}>
                        Enter your details to register
                    </Typography>
                    <TextField fullWidth label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} margin="normal" />
                    <Box className={styles.checkboxContainer}>
                        <Checkbox color="primary" />
                        <Typography variant="body2" className={styles.checkboxLabel}>
                            I agree to the <Link href="#" className={styles.checkboxLink}>terms and conditions</Link>
                        </Typography>
                    </Box>
                    <Button variant="contained" onClick={handleRegister} className={styles.signUpButton}>
                        Sign Up
                    </Button>
                    {message && <Typography color="error" className={styles.message}>{message}</Typography>}
                    <Typography variant="body2" className={styles.signInText}>
                        Already have an account? <Link href="/login" className={styles.signInLink}>Sign in</Link>
                    </Typography>
                </Box>
            </div>
        </div>
    );
}
