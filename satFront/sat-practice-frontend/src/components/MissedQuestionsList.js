import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Button,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const MissedQuestionsList = () => {
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [answerResponse, setAnswerResponse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user ID
  const fetchUserId = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated. Please log in.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const userResponse = await axios.get('http://localhost:8080/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentId(userResponse.data.id);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        setError('Error fetching user ID. Please log in again.');
        setSnackbarOpen(true);
      }
    }
  };

  // Fetch missed questions
  const fetchMissedQuestions = async () => {
    const token = sessionStorage.getItem('token');
    if (!studentId) return;

    try {
      const response = await axios.get(`http://localhost:8080/question/${studentId}/missed-questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMissedQuestions(response.data);
      } else {
        setError('Failed to fetch missed questions.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        setError('Error fetching missed questions. Please try again later.');
        setSnackbarOpen(true);
      }
    }
  };

  // Fetch question details
  const getQuestionDetails = async (questionId, questionSetTitle) => {
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.get(
        `http://localhost:8080/question/${questionSetTitle}/${questionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setQuestionDetails({
        ...response.data,
        questionSetTitle: questionSetTitle,
      });
      setDialogOpen(true); // Open the dialog
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        console.error("Error fetching question:", error);
        alert("Error fetching question details. Please try again.");
      }
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async () => {
    if (!questionDetails || !questionDetails.id || !questionDetails.questionSetTitle || !studentId) {
      setError('Missing required data. Please ensure all fields are filled out.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/question/reattempt`,
        null,
        {
          params: {
            studentId,
            questionId: questionDetails.id,
            questionSetTitle: questionDetails.questionSetTitle,
            selectedAnswer,
          },
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      setAnswerResponse(response.data);

      if (response.data.correct) {
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        console.error("Error submitting answer:", error);
        setAnswerResponse({ correct: false, explanation: "An error occurred. Please try again." });
      }
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchMissedQuestions();
    }
  }, [studentId]);

  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAnswer(''); // Reset selected answer when closing
    setAnswerResponse(null); // Reset answer response when closing
  };

 
  return (

    <Box sx={{ padding: 2 }}>
      <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/student/dashboard')}
        sx={{ marginRight: 2 }} 
      >
        Back
      </Button>
      <Typography variant="h4">
        Missed Questions
      </Typography>
    </Box>
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Card elevation={4} sx={{ marginBottom: 2 }}>
        <CardContent>
          <List>
            {missedQuestions.length > 0 ? (
              missedQuestions.map((question, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => getQuestionDetails(question.questionId, question.questionSetTitle)}
                >
                  <ListItemText
                    primary={`Question Set: ${question.questionSetTitle}`}
                    secondary={`Question ID: ${question.questionId}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">No missed questions to display.</Typography>
            )}
          </List>
        </CardContent>
      </Card>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={error}
        onClose={() => setSnackbarOpen(false)}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Question Details</DialogTitle>
        <DialogContent>
          {questionDetails && (
            <>
              <Typography variant="h6">{questionDetails.text}</Typography>
              <Divider sx={{ margin: '16px 0' }} />
              <Typography variant="body2">Options:</Typography>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              >
                <FormControlLabel value={questionDetails.optionA} control={<Radio />} label={`A: ${questionDetails.optionA}`} />
                <FormControlLabel value={questionDetails.optionB} control={<Radio />} label={`B: ${questionDetails.optionB}`} />
                <FormControlLabel value={questionDetails.optionC} control={<Radio />} label={`C: ${questionDetails.optionC}`} />
                <FormControlLabel value={questionDetails.optionD} control={<Radio />} label={`D: ${questionDetails.optionD}`} />
              </RadioGroup>
              {answerResponse && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body1">
                    {answerResponse.correct ? 'Correct!' : 'Incorrect'}
                  </Typography>
                  <Typography variant="body2">
                    Explanation: {answerResponse.explanation}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button 
            onClick={handleAnswerSubmit} 
            color="primary"
            disabled={!selectedAnswer} // Disable if no answer is selected
          >
            Submit Answer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MissedQuestionsList;