import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
  Box,
  CircularProgress,
} from '@mui/material';

const QuestionAnswering = () => {
  const { title } = useParams();
  const [studentId, setStudentId] = useState('');
  const [questions, setQuestions] = useState({ englishQuestions: [], mathQuestion: [] });
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [missedAnswersCount, setMissedAnswersCount] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchQuestions = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/question/title?title=${encodeURIComponent(title)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) {
          setQuestions(res.data[0]);
          setTotalQuestions(res.data[0].mathQuestion.length + res.data[0].englishQuestions.length);
        } else {
          setQuestions({ englishQuestions: [], mathQuestion: [] });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
          navigate('/login'); 
          }, 3000);
        } else {
          setError('Error fetching questions. Please try again later.');
        setSnackbarOpen(true);
      }
        
      }
    };

    fetchUserId();
    fetchQuestions();
  }, [title]);

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async (e, isQuizCompleted = false) => {
    if (e) e.preventDefault();
  
    setError('');
    setShowExplanation(false);
  
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated. Please log in.');
        setSnackbarOpen(true);
        return;
      }
  
      const currentQuestion = [
        ...questions.mathQuestion,
        ...questions.englishQuestions,
      ][currentQuestionIndex];
  
      const requestBody = {
        studentId,
        questionId: currentQuestion.id,
        questionSetTitle: title,
        selectedAnswer,
        isQuizCompleted,
      };
  
      const result = await axios.post('http://localhost:8080/question/answer', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const isCorrect = result.data.correct;
       
      if (isCorrect) {
        console.log(`Correct Answer for Question ${currentQuestionIndex + 1}`);
        setScore((prevScore) => {
            console.log(`Previous Score: ${prevScore}`);
            return prevScore + 1;
        });
    } else {
        console.log(`Wrong Answer for Question ${currentQuestionIndex + 1}`);
    }
    
  
      setResponses((prev) => [
        ...prev,
        {
          isCorrect,
          explanation: result.data.explanation,
        },
      ]);
  
      setShowExplanation(true);
  
      if (isQuizCompleted) {
        setQuizCompleted(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Error submitting answers. Please try again.');
        setSnackbarOpen(true);
      }
    }
  };
  

  const handleNext = () => {
    setSelectedAnswer('');
    setShowExplanation(false);

    const isQuizCompleted = currentQuestionIndex === totalQuestions - 1;

    if (isQuizCompleted) {
      handleSubmit(null, true); 
    } else {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const markQuestionSetCompleted = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated. Please log in.');
        setSnackbarOpen(true);
        return;
      }

      const questionSetResponse = await axios.get(
        `http://localhost:8080/question/title?title=${encodeURIComponent(title)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (questionSetResponse.data && questionSetResponse.data.length > 0) {
        const questionSetId = questionSetResponse.data[0].id;

        await axios.post(
          `http://localhost:8080/question/${studentId}/completed-question-sets/${questionSetId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSnackbarOpen(true);
        setError('Question set marked as completed successfully.');
      } else {
        setError('Question set not found.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
        navigate('/login'); 
        }, 3000);
      } else {
        setError('Error marking the question set as completed. Please try again.');
      setSnackbarOpen(true);
    }
      
    }
  };
  const handlePracticeClick = (subject) => {
    if (subject === 'English') {
      navigate('/english-question-set');
    } else if (subject === 'Math') {
      navigate('/math-question-set');
    }
  };

  const currentQuestion = [...questions.mathQuestion, ...questions.englishQuestions][currentQuestionIndex];

  const explanationStyles = {
    padding: '10px',
    borderRadius: '8px',
    marginTop: '10px',
    backgroundColor: responses[currentQuestionIndex]?.isCorrect
      ? '#d4edda'
      : '#f8d7da',
    color: responses[currentQuestionIndex]?.isCorrect
      ? '#155724'
      : '#721c24',
    border: `1px solid ${
      responses[currentQuestionIndex]?.isCorrect
        ? '#c3e6cb'
        : '#f5c6cb'
    }`,
  };
  

  useEffect(() => {
    if (quizCompleted) {
      markQuestionSetCompleted();
    }
  }, [quizCompleted]);
  

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      
      <Typography variant="h4" gutterBottom style={{ color: '#4caf50' }}>
        Practice Questions for "{title}"
      </Typography>
      {quizCompleted ? (
        <Box>
          
          <Typography variant="h5" color="primary">
            🎉 Quiz Completed!
          </Typography>
          <Typography variant="h6">Your score: {score} out of {totalQuestions}</Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handlePracticeClick(title.includes('English') ? 'English' : 'Math')}
            style={{ marginTop: '20px' }}
          >
            Back
          </Button>
        </Box>
      ) : currentQuestion ? (
        <form onSubmit={handleSubmit}>
          <Card style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Typography>
              <Typography variant="body1" multiline style={{ margin: '10px 0', fontSize: '16px' }}>
                {currentQuestion.text}
              </Typography>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={{ textAlign: 'left' }}
              >
                {[currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD].map(
                  (option, index) => (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                  )
                )}
              </RadioGroup>
            </CardContent>
          </Card>
          {showExplanation && (
            <Box style={explanationStyles}>
              <Typography style={{ fontWeight: 'bold' }} multiline>
                {responses[currentQuestionIndex]?.explanation}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                style={{ marginTop: '10px' }}
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
              </Button>
            </Box>
          )}
          {!showExplanation && (
    <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!selectedAnswer || responses[currentQuestionIndex]} 
        fullWidth
    >
        Submit Answer
    </Button>
)}

        
        </form>
      ) : (
        <CircularProgress />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Container>
);
};

export default QuestionAnswering;
