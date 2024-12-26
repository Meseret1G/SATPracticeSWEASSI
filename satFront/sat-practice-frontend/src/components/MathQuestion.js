import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, MenuItem, Typography, Grid, Paper, Snackbar } from "@mui/material";
import { ArrowForward, ArrowBack, CheckCircle } from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MathQuestionForm = () => {
  const [questions, setQuestions] = useState([createEmptyMathQuestion()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function createEmptyMathQuestion() {
    return {
      topic: "",
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
    updatedQuestions[index][name] = value;
    setQuestions(updatedQuestions);
  };

  const token = sessionStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (questions.length !== 5) {
      showSnackbar("You must add exactly 5 questions before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/question/add?questionType=MATH`,
        { mathQuestion: questions },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("Math questions added successfully!");
      setQuestions([createEmptyMathQuestion()]);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error adding math questions:", error);
      showSnackbar("Failed to add math questions.");
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (questions.length < 5) {
      setQuestions([...questions, createEmptyMathQuestion()]);
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
      currentQuestion.topic &&
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

  return (
    <Paper elevation={3} style={{ padding: '30px', maxWidth: '800px', margin: '20px auto', backgroundColor: '#e3f2fd' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#333' }}>
        Add Math Questions
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="question-input" style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Question {currentIndex + 1}</Typography>
          <MathQuestionInput
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
    </Paper>
  );
};

const MathQuestionInput = ({ question, index, handleQuestionChange }) => (
  <>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          select
          label="Topic"
          name="topic"
          value={question.topic}
          onChange={(e) => handleQuestionChange(index, e)}
          required
        >
          <MenuItem value="">Select Topic</MenuItem>
          <MenuItem value="Algebra">Algebra Basics</MenuItem>
          <MenuItem value="Geometry">Geometry Fundamentals</MenuItem>
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
          <MenuItem value={question.optionA}>{'Option A'}</MenuItem>
          <MenuItem value={question.optionB}>{'Option B'}</MenuItem>
          <MenuItem value={question.optionC}>{'Option C'}</MenuItem>
          <MenuItem value={question.optionD}>{'Option D'}</MenuItem>
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
  </>
);

export default MathQuestionForm;