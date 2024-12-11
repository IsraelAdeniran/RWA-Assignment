"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Checkbox, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import emailValidator from 'email-validator';
import styles from "./register.module.css";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleRegister = async () => {
        // Validation
        if (!firstName || !lastName || !username || !email || !password) {
            setErrorMessage("All fields are required.");
            setOpenDialog(true);
            return;
        }

        if (!emailValidator.validate(email)) {
            setErrorMessage("Please enter a valid email address.");
            setOpenDialog(true);
            return;
        }

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
                setErrorMessage(data.message || "Registration failed.");
                setOpenDialog(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage("An error occurred. Please try again.");
            setOpenDialog(true);
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

            {/* Dialog for error messages */}
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
