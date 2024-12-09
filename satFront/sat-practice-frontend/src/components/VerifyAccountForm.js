import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const VerifyAccountForm = () => {
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
            const response = await axios.post("http://localhost:8080/verifyAccount", {
                email,
                otp,
            });

            setMessage(response.data);

            if (response.data === "OTP verified. You can log in.") {
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
                setOtp("");
            }
        } catch (error) {
            setMessage(error.response?.data || "Error during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateOtp = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/regenerateOtp", {
                email,
            });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data || "Error during OTP regeneration.");
        } finally {
            setIsLoading(false);
        }
    };

    const isOtpExpired = message === "OTP has expired. Please regenerate OTP.";

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Verify Account
                </Typography>
                <form onSubmit={handleVerify}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        InputProps={{
                            readOnly: true,
                        }}
                        required
                    />
                    <TextField
                        label="OTP"
                        type="text"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
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
                        {isLoading ? <CircularProgress size={24} /> : "Verify"}
                    </Button>
                </form>
                {message && <Alert severity={message.includes("success") ? "success" : "error"} sx={{ marginTop: 2 }}>{message}</Alert>}
                <Button
                    onClick={handleRegenerateOtp}
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={isLoading || !isOtpExpired} 
                >
                    {isLoading ? <CircularProgress size={24} /> : "Regenerate OTP"}
                </Button>
            </Box>
        </Container>
    );
};

export default VerifyAccountForm;