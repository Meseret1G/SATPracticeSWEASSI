import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const DisplayMathQuestions = () => {
  const { topic } = useParams();
  const [mathQuestions, setMathQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleDetails, setVisibleDetails] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8080/question/math-questions/topic/${topic}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMathQuestions(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login'); 
          }, 3000);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchQuestions();
    }
  }, [topic]);

  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => (prevState === id ? null : id));
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setOpenDialog(true);
  };

  const handleReplace = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/question/math-questions/${editingQuestion.id}`, editingQuestion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMathQuestions((prevQuestions) =>
        prevQuestions.map((question) => (question.id === editingQuestion.id ? { ...editingQuestion } : question))
      );
      setEditingQuestion(null);
      setOpenDialog(false);
      showSnackbar("Question updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        setError('Failed to replace the question');
      }
    }
  };

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;
    setEditingQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const filteredQuestions = mathQuestions.filter(question =>
    (question.title && question.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (question.text && question.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isEditingQuestionValid = () => {
    return (
      editingQuestion &&
      editingQuestion.text &&
      editingQuestion.optionA &&
      editingQuestion.optionB &&
      editingQuestion.optionC &&
      editingQuestion.optionD &&
      editingQuestion.correctAnswer &&
      editingQuestion.difficulty
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>No topic provided.</div>;

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/dashboard')}
              sx={{ marginBottom: 2 }}
            >
              Back
            </Button>
      <Typography variant="h4" gutterBottom align="center" style={{ color: '#333' }}>
        Math Questions for Topic: {topic}
      </Typography>
      <TextField
        fullWidth
        label="Search Questions"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputProps={{
          style: { borderRadius: '5px' },
        }}
      />
      <Grid container spacing={3}>
        {filteredQuestions.map((question) => (
          <Grid item xs={12} sm={6} key={question.id}>
            <Card variant="outlined" style={{ transition: '0.3s', cursor: 'pointer', backgroundColor: '#e3f2fd', borderRadius: '10px' }} 
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'} 
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <CardContent onClick={() => toggleDetails(question.id)}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#007BFF' }}>{question.title}</Typography>
                <Typography variant="body1" style={{ marginTop: '10px', color: '#007BFF', textDecoration: 'underline', cursor: 'pointer' }}>
                  {question.text}
                </Typography>

                {visibleDetails === question.id && (
                  <Card variant="outlined" style={{ marginTop: '10px', padding: '10px', borderRadius: '10px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#333' }}>Choices:</Typography>
                      <Typography style={{ marginBottom: '5px' }}>A: {question.optionA}</Typography>
                      <Typography style={{ marginBottom: '5px' }}>B: {question.optionB}</Typography>
                      <Typography style={{ marginBottom: '5px' }}>C: {question.optionC}</Typography>
                      <Typography style={{ marginBottom: '5px' }}>D: {question.optionD}</Typography>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginTop: '10px', color: '#333' }}>Details:</Typography>
                      <Typography><strong>Correct Answer:</strong> {question.correctAnswer}</Typography>
                      <Typography><strong>Difficulty:</strong> {question.difficulty}</Typography>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(question)}>Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Text"
            name="text"
            value={editingQuestion ? editingQuestion.text : ''}
            onChange={handleQuestionChange}
            style={{ marginBottom: '10px' }}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Option A"
            name="optionA"
            value={editingQuestion ? editingQuestion.optionA : ''}
            onChange={handleQuestionChange}
            style={{ marginBottom: '10px' }}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Option B"
            name="optionB"
            value={editingQuestion ? editingQuestion.optionB : ''}
            onChange={handleQuestionChange}
            style={{ marginBottom: '10px' }}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Option C"
            name="optionC"
            value={editingQuestion ? editingQuestion.optionC : ''}
            onChange={handleQuestionChange}
            style={{ marginBottom: '10px' }}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Option D"
            name="optionD"
            value={editingQuestion ? editingQuestion.optionD : ''}
            onChange={handleQuestionChange}
            style={{ marginBottom: '10px' }}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            select
            label="Correct Answer"
            name="correctAnswer"
            value={editingQuestion ? editingQuestion.correctAnswer : ''}
            onChange={handleQuestionChange}
            required
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="">Select Answer</MenuItem>
            <MenuItem value={editingQuestion?.optionA}>{editingQuestion?.optionA}</MenuItem>
            <MenuItem value={editingQuestion?.optionB}>{editingQuestion?.optionB}</MenuItem>
            <MenuItem value={editingQuestion?.optionC}>{editingQuestion?.optionC}</MenuItem>
            <MenuItem value={editingQuestion?.optionD}>{editingQuestion?.optionD}</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Difficulty"
            name="difficulty"
            value={editingQuestion ? editingQuestion.difficulty : ''}
            onChange={handleQuestionChange}
            required
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="">Select Difficulty</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleReplace} color="primary" disabled={!isEditingQuestionValid()}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DisplayMathQuestions;