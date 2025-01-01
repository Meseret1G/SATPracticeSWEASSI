import React, { useState, useEffect } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Button,
  Avatar,
  Grid,
  TextField,
  Stack,
  DialogActions,
  DialogContent,
  Card,
  CardContent,
  Collapse,
  Slider,
  CircularProgress,
  Rating,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutline from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const StudentDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser ] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openPractice, setOpenPractice] = useState(false);
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState(null);
  const [missedQuestionsCount, setMissedQuestionsCount] = useState(null);
  const [setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      setError('No token found. Please log in.');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login'); 
      }, 3000); 
      return;
    }
    try {
      const response = await axios.get('http://localhost:8080/student/s_info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser (response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        username: response.data.username || '',
      });
      setLoading(false); 
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        console.error("Error fetching user info:", err);
        setMessage("Failed to fetch user information.");
        setMessageDrawerOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleProfileClick = () => {
    setOpenDialog(true);
  };

  const handleEditClick = async () => {
    if (isEditing) {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
        return;
      }
      if (!formData || Object.values(formData).some(value => value === null || value === '')) {
        setMessage("Please fill in all required fields.");
        setMessageDrawerOpen(true);
        return;
    }
      try {
        const response = await axios.put('http://localhost:8080/student/edit', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser (response.data);
          setIsEditing(false);
          setMessage("Your information has been successfully saved!");
          setMessageDrawerOpen(true);
        } else {
          setMessage("Failed to update user information.");
          setMessageDrawerOpen(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login'); 
          }, 3000);
        } else {
          console.error("Error saving user info:", err);
          setMessage("Failed to save user information. Please try again.");
          setMessageDrawerOpen(true);
        }
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleTogglePractice = () => {
    setOpenPractice((prev) => !prev);
  };
  const handleMissedPractice = () => {
    navigate("/missed-questions")
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage("No token found. You are not logged in.");
      setMessageDrawerOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        sessionStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        console.error("Logout failed:", err.response ? err.response.data : err.message);
        setMessage("Logout failed. Please try again.");
        setMessageDrawerOpen(true);
      }
    }
  };

  const handleCloseMessageDrawer = async () => {
    setMessageDrawerOpen(false);
    setOpenDialog(false); 
    window.location.reload(); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchUserInfo();
  };

  const handlePracticeClick = (subject) => {
    if (subject === 'English') {
      navigate('/english-question-set');
    } else if (subject === 'Math') {
      navigate('/math-question-set');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('User  is not authenticated. Please log in.');
      setSnackbarOpen(true);
      return;
    }

    const fetchStudentInfo = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8080/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentId(userResponse.data.id);
      } catch (err) {
        if (err.response && err.response.status === 401) {
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

    const fetchMissedQuestionsCount = async () => {
      if (studentId) {
        try {
          const missedQuestionsResponse = await axios.get(
            `http://localhost:8080/question/${studentId}/missed-questions/count`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMissedQuestionsCount(missedQuestionsResponse.data);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            alert('Session expired. Please log in again.');
            setTimeout(() => {
              navigate('/login'); 
            }, 3000);
          } else {
            setError('Error fetching missed questions count.');
            setSnackbarOpen(true);
          }
        }
      }
    };

    fetchStudentInfo();
    fetchMissedQuestionsCount();
  }, [studentId]);

  return (
    <Box display="flex" flexDirection="column" height="100vh" sx={{ margin: 2, backgroundColor: '#f0f0f0' }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Student Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250, padding: 2 }}>
            <Stack direction="row" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: '#3f51b5', marginRight: 1 }}>
                {user && user.firstName ? user.firstName.charAt(0) : 'U'}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                {user ? user.firstName : 'Loading...'}
              </Typography>
            </Stack>
            <Divider sx={{ marginBottom: 2 }} />

            <List>
              <ListItem button onClick={() => setDrawerOpen(false)}>
                <HomeIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={handleProfileClick}>
                <AccountCircle sx={{ marginRight: 1 }} />
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleTogglePractice}>
                <ListItemText primary="Practice" />
                {openPractice ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openPractice} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button sx={{ pl: 4 }} onClick={() => handlePracticeClick('English')}>
                    <ListItemText primary="English" />
                  </ListItem>
                  <ListItem button sx={{ pl: 4 }} onClick={() => handlePracticeClick('Math')}>
                    <ListItemText primary="Math" />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem button onClick={() => setDrawerOpen(false)}>
                <HelpOutline sx={{ marginRight: 1 }} />
                <ListItemText primary="About SAT" />
              </ListItem>
              <ListItem button onClick={() => setDrawerOpen(false)}>
                <SettingsIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ExitToAppIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box flexGrow={1} p={2} sx={{ bgcolor: '#ffffff' }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user ? user.firstName : 'Loading...'}!
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575' }}>
            This is your dashboard where you can manage your activities and track your progress.
          </Typography>
          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ '&:hover': { boxShadow: 20 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Target Score</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', marginRight: 2 }}>
                      {user && user.targetScore ? user.targetScore : 'Loading...'}
                    </Typography>
                    <Rating
                      name="target-score"
                      value={user && user.targetScore ? user.targetScore / 20 : 0}
                      precision={0.1}
                      readOnly
                      size="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <Card elevation={4} sx={{ '&:hover': { boxShadow: 20 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Percent Score
        </Typography>
        <Box display="flex" alignItems="center">
          {loading ? (
            <CircularProgress size={24} />
          ) : error ? (
            <Typography color="error">Error loading score</Typography>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginRight: 2 }}>
                {user.percentScore.toFixed(2)}%
              </Typography>
              <Slider
                aria-label="Percent Score"
                value={user.percentScore}
                max={100}
                disabled
                sx={{ width: '100%' }}
              />
            </>
          )}
        </Box>
      </CardContent>
    </Card>
    </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ '&:hover': { boxShadow: 20 } }} onClick={() =>handleMissedPractice()}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Missed Questions</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {missedQuestionsCount !== null ? (
                      <h3>{missedQuestionsCount}</h3>
                    ) : (
                      <h3>Loading...</h3>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Profile Drawer */}
      <Drawer 
        anchor="right" 
        open={openDialog} 
        onClose={handleCloseDialog} 
        variant="temporary"
        sx={{ width: 300 }} 
      >
        <Box sx={{ width: 300, padding: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center">
              <Avatar sx={{ fontSize: 48, bgcolor: '#3f51b5', boxShadow: 2, border: '2px solid #ffffff' }} />
              <Typography variant="body2" sx={{ marginLeft: 1, color: '#333', fontWeight: 'bold' }}>
                {user ? user.username : 'Loading...'}
              </Typography>
            </Stack>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ marginBottom: 2 }} />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z]*$/.test(value)) {
                      setFormData({ ...formData, firstName: value });
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={!isEditing}
                  required
                  inputProps={{
                    minLength: 4,
                    maxLength: 50,
                  }}
                  sx={{ bgcolor: isEditing ? 'white' : '#f0f0f0' }}
                  helperText={
                    formData.firstName &&
                    !/^[A-Za-z]+$/.test(formData.firstName)
                      ? "Only alphabets are allowed."
                      : formData.firstName.length < 4
                      ? "First name must be at least 4 characters."
                      : formData.firstName.length > 50
                      ? "First name must be no longer than 50 characters."
                      : ""
                  }
                  error={
                    formData.firstName &&
                    (!/^[A-Za-z]+$/.test(formData.firstName) ||
                      formData.firstName.length < 4 ||
                      formData.firstName.length > 50)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z]*$/.test(value)) {
                      setFormData({ ...formData, lastName: value });
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={!isEditing}
                  required
                  inputProps={{
                    minLength: 4,
                    maxLength: 50,
                  }}
                  sx={{ bgcolor: isEditing ? 'white' : '#f0f0f0' }}
                  helperText={
                    formData.lastName &&
                    !/^[A-Za-z]+$/.test(formData.lastName)
                      ? "Only alphabets are allowed."
                      : formData.lastName.length < 4
                      ? "Last name must be at least 4 characters."
                      : formData.lastName.length > 50
                      ? "Last name must be no longer than 50 characters."
                      : ""
                  }
                  error={
                    formData.lastName &&
                    (!/^[A-Za-z]+$/.test(formData.lastName) ||
                      formData.lastName .length < 4 ||
                      formData.lastName.length > 50)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={!isEditing}
                  sx={{ bgcolor: isEditing ? 'white' : '#f0f0f0' }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleEditClick} color="primary">
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </DialogActions>
        </Box>
      </Drawer>

      {/* Message Drawer */}
      <Drawer 
        anchor="bottom" 
        open={messageDrawerOpen} 
        onClose={handleCloseMessageDrawer} 
        variant="temporary"
        sx={{ width: '100%', height: 60 }}
      >
        <Box sx={{ padding: 2, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {message}
          </Typography>
          <IconButton onClick={handleCloseMessageDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default StudentDashboard;