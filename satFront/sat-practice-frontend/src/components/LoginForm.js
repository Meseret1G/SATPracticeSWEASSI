import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (!username || !password) {
            setMessage("Username and password are required.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Attempting login with:", username, password);

            const response = await axios.post("http://localhost:8080/login", {
                username,
                password,
            });

            console.log("Login response:", response.data);

            const { token, role, isFirstLogin } = response.data; 

            if (!token) {
                throw new Error("No token received.");
            }

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userRole", role);
            if (role === "STUDENT") {
                if (isFirstLogin) { 
                    navigate("/student/student-info"); 
                } else {
                    navigate("/student/dashboard"); 
                }
            } else if (role === "ADMIN") {
                navigate("/admin/dashboard");
            }

        } catch (error) {
            // Directly set the message based on the error response
            if (error.response) {
                
                setMessage(error.response.data?.error || "An unexpected error occurred.");
            }
            else {
                setMessage("An unexpected error occurred."); // Fallback for network errors
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const handleForgotUsername = () => {
        navigate("/forgot-username");
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
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
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ marginTop: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                </form>
                {message && <Alert severity="error" sx={{ marginTop: 2 }}>{message}</Alert>}
                <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
                    <Button onClick={handleRegister} color="primary">
                        Register
                    </Button>
                    <Button onClick={handleForgotPassword} color="secondary">
                        Forgot Password?
                    </Button>
                </Box>
                <Button onClick={handleForgotUsername} color="secondary">
                    Forgot Username?
                </Button>
            </Box>
        </Container>
    );
};

export default LoginForm;