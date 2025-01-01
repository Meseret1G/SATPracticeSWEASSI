import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, MenuItem, Typography, Grid, Paper, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ArrowForward, ArrowBack, CheckCircle } from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EnglishQuestionForm = () => {
  const [questions, setQuestions] = useState([createEmptyEnglishQuestion()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFormModified, setIsFormModified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);  // Dialog open state
  const navigate = useNavigate();

  function createEmptyEnglishQuestion() {
    return {
      questionType: "",
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      explanation: "",
      difficulty: "",
    };
  }

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...questions];
    const { name, value } = event.target;

    if (name === "topic") {
      updatedQuestions[index].questionType = value;
    }

    updatedQuestions[index][name] = value;
    setQuestions(updatedQuestions);
    setIsFormModified(true);  // Set form as modified
  };

  const token = sessionStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (questions.length !== 5) {
      showSnackbar("You must add exactly 5 questions before submitting.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/question/add?questionType=ENGLISH`,
        { englishQuestions: questions },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("English questions added successfully!");
      setQuestions([createEmptyEnglishQuestion()]);
      setCurrentIndex(0);
      setIsFormModified(false);  // Reset modified state
    } catch (error) {
      if (error.response) {
        // Check if the error response contains a message from the backend
        const errorMessage = error.response.data?.error || "Failed to add English questions.";
        showSnackbar(errorMessage); // Show the error message from the backend
      } else if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else if (error.response && error.response.status === 500) {
        showSnackbar(error.response?.data);
      } else {
        console.error("Error adding English questions:", error);
        showSnackbar("Failed to add English questions.");
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (questions.length < 5) {
      setQuestions([...questions, createEmptyEnglishQuestion()]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isCurrentQuestionValid = () => {
    const currentQuestion = questions[currentIndex];
    return (
      currentQuestion.questionType &&
      currentQuestion.text &&
      currentQuestion.optionA &&
      currentQuestion.optionB &&
      currentQuestion.optionC &&
      currentQuestion.optionD &&
      currentQuestion.correctAnswer &&
      currentQuestion.explanation &&
      currentQuestion.difficulty
    );
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Warn the user if there are unsaved changes when trying to navigate away
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFormModified) {
        const message = "You have unsaved changes, are you sure you want to leave?";
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormModified]);

  // Open dialog when attempting to navigate away
  const handleBackButtonClick = () => {
    if (isFormModified) {
      setOpenDialog(true);  // Open the confirmation dialog
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Handle the dialog confirmation
  const handleDialogClose = (confirm) => {
    if (confirm) {
      navigate('/admin/dashboard');
    }
    setOpenDialog(false);
  };

  return (
    <Paper elevation={3} style={{ padding: '30px', maxWidth: '800px', margin: '20px auto', backgroundColor: '#e3f2fd' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackButtonClick}
        sx={{ marginBottom: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#333' }}>
        Add English Questions
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="question-input" style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Question {currentIndex + 1}</Typography>
          <EnglishQuestionInput
            question={questions[currentIndex]}
            index={currentIndex}
            handleQuestionChange={handleQuestionChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={goToPreviousQuestion}
            disabled={currentIndex === 0}
            startIcon={<ArrowBack />}
          >
            Previous
          </Button>

          {currentIndex === 4 ? (
            <Button variant="contained" color="success" type="submit" endIcon={<CheckCircle />}>
              Submit Questions
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={goToNextQuestion}
              disabled={!isCurrentQuestionValid()}
              endIcon={<ArrowForward />}
            >
              Next
            </Button>
          )}
        </div>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for unsaved changes warning */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to go back?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Yes, Go Back
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const EnglishQuestionInput = ({ question, index, handleQuestionChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        select
        label="Topic"
        name="topic"
        value={question.questionType}
        onChange={(e) => handleQuestionChange(index, e)}
        required
      >
        <MenuItem value="">Select Topic</MenuItem>
        <MenuItem value="Grammar">Grammar Essentials</MenuItem>
        <MenuItem value="Reading">Reading Comprehension</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Question Text"
        name="text"
        value={question.text}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={4}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Option A"
        name="optionA"
        value={question.optionA}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={2}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Option B"
        name="optionB"
        value={question.optionB}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={2}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Option C"
        name="optionC"
        value={question.optionC}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={2}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Option D"
        name="optionD"
        value={question.optionD}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={2}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        select
        label="Correct Answer"
        name="correctAnswer"
        value={question.correctAnswer}
        onChange={(e) => handleQuestionChange(index, e)}
        required
      >
        <MenuItem value="">Select Answer</MenuItem>
        <MenuItem value={question.optionA}>Option A</MenuItem>
        <MenuItem value={question.optionB}>Option B</MenuItem>
        <MenuItem value={question.optionC}>Option C</MenuItem>
        <MenuItem value={question.optionD}>Option D</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Explanation"
        name="explanation"
        value={question.explanation}
        onChange={(e) => handleQuestionChange(index, e)}
        required
        multiline
        rows={4}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        select
        label="Difficulty"
        name="difficulty"
        value={question.difficulty}
        onChange={(e) => handleQuestionChange(index, e)}
        required
      >
        <MenuItem value="">Select Difficulty</MenuItem>
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>
    </Grid>
  </Grid>
);

export default EnglishQuestionForm;
