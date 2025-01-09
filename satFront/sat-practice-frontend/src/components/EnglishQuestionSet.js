import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, Snackbar, Button, Card, CardContent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const EnglishQuestionSet = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [completedSets, setCompletedSets] = useState(new Set());
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated. Please log in.');
      setSnackbarOpen(true);
      return;
    }

    axios
      .get('http://localhost:8080/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStudentId(response.data.id);
      })
      .catch((error) => {
        console.error('Request failed:', error);
        handleAuthError(error);
      });
  }, []);

  useEffect(() => {
    if (studentId) {
      loadQuestionSets();
      loadCompletedSets();
    }
  }, [studentId]);

  const loadQuestionSets = () => {
    const token = sessionStorage.getItem('token');
    setLoading(true);
    axios
      .get(`http://localhost:8080/question/byType?type=English&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setQuestionSets((prev) => [...prev, ...response.data.content]);
        setHasMore(!response.data.last);
      })
      .catch((error) => {
        console.error('Failed to fetch question sets:', error);
        handleAuthError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadCompletedSets = () => {
    const token = sessionStorage.getItem('token');
    axios
      .get(`http://localhost:8080/question/${studentId}/completed-question-sets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const completedTitles = new Set(response.data.map((set) => set.title));
        setCompletedSets(completedTitles);
      })
      .catch((error) => {
        console.error('Failed to fetch completed question sets:', error);
        handleAuthError(error);
      });
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
      setTimeout(() => navigate('/login'), 3000);
    } else if (error.response?.status === 403) {
      alert('Access denied. You do not have permission to access this resource.');
    } else {
      setError('An error occurred. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target.documentElement;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  useEffect(() => {
    if (page > 0) loadQuestionSets();
  }, [page]);

  const handleTitleClick = (title, index) => {
    if (isSetUnlocked(index)) {
      navigate(`/questionSet/${encodeURIComponent(title)}`);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const isSetUnlocked = (index) => {
    if (completedSets.has(questionSets[index].title)) {
      return true;
    }

    const completedArray = Array.from(completedSets);
    const lastCompletedTitle = completedArray[completedArray.length - 2];

    const lastCompletedIndex = questionSets.findIndex(set => set.title === lastCompletedTitle);
    return index === lastCompletedIndex + 1;
  };

  return (
    <Container sx={{ paddingTop: 3 }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/student/dashboard')}
        sx={{ marginBottom: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4 }}>
        English Question Sets
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

      {loading && <Typography align="center">Loading more question sets...</Typography>}

      <List>
        {questionSets.map((questionSet, index) => (
          <ListItem
            button
            key={questionSet.id}
            onClick={() => handleTitleClick(questionSet.title, index)}
            sx={{ marginBottom: 2 }}
            disabled={!isSetUnlocked(index)}
          >
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
                opacity: !isSetUnlocked(index) ? 0.5 : 1, // Reduce opacity of locked sets
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="h6">
                  {questionSet.title}
                  {completedSets.has(questionSet.title) && <CheckIcon sx={{ marginLeft: 1, color: 'green' }} />}
                  {!isSetUnlocked(index) && <LockIcon sx={{ marginLeft: 1, color: 'gray' }} />}
                </Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {!hasMore && questionSets.length === 0 && (
        <Typography variant="h6" align="center">
          No more question sets available.
        </Typography>
      )}
    </Container>
  );
};

export default EnglishQuestionSet;
