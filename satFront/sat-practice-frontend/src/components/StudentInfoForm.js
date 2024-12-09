import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentInfoForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [targetScore, setTargetScore] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const score = parseInt(targetScore, 10);
        if (score > 1600) {
            setDialogMessage("The target score can't be greater than 1600.");
            setIsError(true);
            setDialogOpen(true);
            return;
        }

        const studentInfoDTO = {
            firstName,
            lastName,
            targetScore: score,
        };

        try {
            
            const token = sessionStorage.getItem('token');  

            const response = await axios.post('http://localhost:8080/student/studentInfo', studentInfoDTO, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            setDialogMessage(response.data.message || 'Success');
            setIsError(false);
            setDialogOpen(true); 
        } catch (err) {
            setDialogMessage(err.response?.data || 'An error occurred.');
            setIsError(true);
            setDialogOpen(true); 
        }
    };

    const handleClose = () => {
        setDialogOpen(false);
        if (!isError) {
            navigate('/student/dashboard'); 
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Student Information
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    margin="normal"
                />
                <TextField
                    label="Target Score"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    required
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Submit
                </Button>
            </form>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>{isError ? 'Error' : 'Success'}</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {isError ? 'Close' : 'Go to Dashboard'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default StudentInfoForm;
