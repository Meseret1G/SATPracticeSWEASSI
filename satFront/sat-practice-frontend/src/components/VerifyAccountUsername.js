import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const VerifyAccountUsername = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
    
        try {
            const response = await axios.post("http://localhost:8080/verifyAccountReset", {
                email,
                otp,
            });
    
            setMessage(response.data);
    
            if (response.data === "OTP verified successfully. You can now reset your password.") {
                sessionStorage.setItem("userOtp", otp);
                setTimeout(() => {
                    navigate("/reset-username");
                }, 1000); 
            }
        } catch (error) {
            setMessage(error.response?.data || "Error verifying account.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateOtp = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/regenerateOtp", { email });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data || "Error regenerating OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Verify Account Reset
                </Typography>

                <form onSubmit={handleVerify}>
                    <TextField
                        label="OTP"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ marginTop: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Verify"}
                    </Button>
                </form>
                {message && <Alert severity="info" sx={{ marginTop: 2 }}>{message}</Alert>}

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleRegenerateOtp}
                    disabled={isLoading}
                    sx={{ marginTop: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : "Regenerate OTP"}
                </Button>

                <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/forgot-password')}
                    sx={{ marginTop: 2 }}
                >
                    Back to Forgot Password
                </Button>
            </Box>
        </Container>
    );
};

export default VerifyAccountUsername;