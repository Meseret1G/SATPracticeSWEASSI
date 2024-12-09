import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/student/register", {
                username,
                email,
                password,
            });

            setMessage(response.data);
            if (response.data === "User registered successfully! Please verify your email.") {
                sessionStorage.setItem("userEmail", email);
                navigate("/verify-account");
            }
        } catch (error) {
            setMessage(error.response?.data || "Error during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ marginTop: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Register"}
                    </Button>
                </form>
                {message && <Alert severity="error" sx={{ marginTop: 2 }}>{message}</Alert>}
                <Button
                    onClick={() => navigate("/login")}
                    variant="text"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
};

export default Register;