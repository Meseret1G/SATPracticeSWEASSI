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

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8080/question/math-questions/topic/${topic}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMathQuestions(response.data);
      } catch (err) {
        setError(err.message);
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
    } catch (err) {
      setError('Failed to replace the question');
    }
  };
  const handleQuestionChange = (index, event) => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>No topic provided.</div>;

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
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
            <Card variant="outlined" style={{ transition: '0.3s', cursor: 'pointer',backgroundColor: '#e3f2fd', borderRadius: '10px' }} 
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

      <Dialog  open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent >
          <TextField
            fullWidth
            label="Text"
            value={editingQuestion ? editingQuestion.text : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Option A"
            value={editingQuestion ? editingQuestion.optionA : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, optionA: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Option B"
            value={editingQuestion ? editingQuestion.optionB : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, optionB: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Option C"
            value={editingQuestion ? editingQuestion.optionC : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, optionC: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Option D"
            value={editingQuestion ? editingQuestion.optionD : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, optionD: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Correct Answer"
            value={editingQuestion ? editingQuestion.correctAnswer : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Explanation"
            value={editingQuestion ? editingQuestion.explanation : ''}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
         <TextField
              fullWidth
              select
              label="Difficulty"
              name="difficulty"
              value={editingQuestion ? editingQuestion.difficulty : ''}
              onChange={(e) => handleQuestionChange(null, e)}
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
          <Button onClick={handleReplace} color="primary">Save Changes</Button>
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