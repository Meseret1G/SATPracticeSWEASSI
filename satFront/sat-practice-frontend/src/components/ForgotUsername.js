import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, Alert, CircularProgress } from "@mui/material";

const ForgotUsername = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotUsername= async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true); 

        try {
            const response = await axios.post(`http://localhost:8080/forgotUsername?email=${encodeURIComponent(email)}`);
            console.log("Response from server:", response.data);
            setMessage(response.data);

            if (response.data === "OTP sent to your email."||response.data ==="A valid OTP already exists. Please use the existing OTP.") {
                sessionStorage.setItem("userEmail", email);
                setTimeout(() => {
                    navigate("/verify-account-username");
                }, 1000); 
            }
        } catch (error) {
            setMessage(error.response?.data || "Failed to send OTP.");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Forgot Username
                </Typography>
                <form onSubmit={handleForgotUsername}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ marginTop: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Send OTP"}
                    </Button>
                </form>
                {message && <Alert severity="info" sx={{ marginTop: 2 }}>{message}</Alert>}

                <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/login')} color="primary">
                        Back to Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotUsername;