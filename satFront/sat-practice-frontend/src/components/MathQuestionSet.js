import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, Snackbar, Button, Card, CardContent} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const MathQuestionSet = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [completedSets, setCompletedSets] = useState(new Set());
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated. Please log in.');
      setSnackbarOpen(true);
      return;
    }

    // Fetch the studentId from the 'me' endpoint
    axios.get('http://localhost:8080/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const studentId = response.data.id;
        setStudentId(studentId);
        console.log('Student ID:', studentId); // Log the studentId
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
          navigate('/login'); 
          }, 3000);
        } else {
          setError('Failed to fetch user data.');
        setSnackbarOpen(true);
        console.error(error);
      }
        
      });

    // Fetch all Math question sets
    axios.get('http://localhost:8080/question/byType?type=Math', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setQuestionSets(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
          navigate('/login'); 
          }, 3000);
        } else {
          setError('Failed to fetch question sets.');
        setSnackbarOpen(true);
        console.error(error);
      }
        
      });

  }, []); // Empty dependency array, runs only once when component mounts

  useEffect(() => {
    if (studentId) {
      // Fetch completed question sets for the student
      console.log('Fetching completed question sets for student:', studentId); // Log before making the request
      axios.get(`http://localhost:8080/question/${studentId}/completed-question-sets`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          const completedTitles = new Set(response.data.map((set) => set.title));
          setCompletedSets(completedTitles);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert('Session expired. Please log in again.');
            setTimeout(() => {
            navigate('/login'); 
            }, 3000);
          } else {
            setError('Failed to fetch completed question sets.');
          setSnackbarOpen(true);
          console.error(error);
        }
          
        });
    }
  }, [studentId]); // Re-fetch completed sets when studentId changes

  const handleTitleClick = (title) => {
    if (title) {
      navigate(`/questionSet/${encodeURIComponent(title)}`);
    } else {
      setError('Title is missing.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ paddingTop: 3 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/student/dashboard')}
        sx={{ marginBottom: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4 }}>
        Math Question Sets
      </Typography>

      {error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={error}
          sx={{
            backgroundColor: 'error.main',
            color: 'white',
          }}
        />
      )}

      {questionSets.length > 0 ? (
        <List>
          {questionSets.map((questionSet) => (
            <ListItem
              button
              key={questionSet.id}
              onClick={() => handleTitleClick(questionSet.title)}
              sx={{ marginBottom: 2 }}
            >
              <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: 2, borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {questionSet.title}
                    {/* Show checkmark if the question set is completed */}
                    {completedSets.has(questionSet.title) && (
                      <CheckIcon sx={{ marginLeft: 1, color: 'green' }} />
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="h6" align="center">
          No Math question sets available.
        </Typography>
      )}
    </Container>
  );
};

export default MathQuestionSet;
