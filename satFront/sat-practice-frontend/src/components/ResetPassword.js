import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const email = sessionStorage.getItem("userEmail");
    const otp = sessionStorage.getItem("userOtp");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/resetPassword", {
                email,
                otp, 
                newPassword,
            });

            setMessage(response.data);

            if (response.data === "Password has been reset successfully.") {
              setTimeout(()=>{
                navigate("/login");
              },1000);
            }
        } catch (error) {
            setMessage(error.response?.data || "Error resetting password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleResetPassword}>
                    <input type="hidden" value={otp} />
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? <CircularProgress size={24} /> : "Reset Password"}
                    </Button>
                </form>
                {message && <Alert severity="info" sx={{ marginTop: 2 }}>{message}</Alert>}
                <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{ marginTop: 2 }}
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
};

export default ResetPassword;