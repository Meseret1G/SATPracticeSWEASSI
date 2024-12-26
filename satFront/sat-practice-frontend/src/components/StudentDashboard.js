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
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openPractice, setOpenPractice] = useState(false);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/student/s_info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        username: response.data.username || '',
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
      setMessage("Failed to fetch user information.");
      setMessageDrawerOpen(true);
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
      try {
        const response = await axios.put('http://localhost:8080/student/edit', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
          setIsEditing(false);
          setMessage("Your information has been successfully saved!");
          setMessageDrawerOpen(true);
        } else {
          setMessage("Failed to update user information.");
          setMessageDrawerOpen(true);
        }
      } catch (error) {
        console.error("Error saving user info:", error);
        setMessage("Failed to save user information. Please try again.");
        setMessageDrawerOpen(true);
      }
    } else {
      setIsEditing(true);
    }
  };
  const handleTogglePractice = () => {
    setOpenPractice((prev) => !prev);
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
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
      setMessage("Logout failed. Please try again.");
      setMessageDrawerOpen(true);
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

              {/* <ListItem button onClick={() => console.log('Quiz clicked')}>
                <ListItemText primary="Quiz" />
              </ListItem> */}
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
                      {user ? user.targetScore : 'Loading...'}
                    </Typography>
                    <Rating
                      name="target-score"
                      value={user ? user.targetScore / 20 : 0}
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
                  <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Percent Score</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {user ? user.percentScore : 'Loading...'}%
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
  sx={{ width: 300 }} // Set the width to 300px
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
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={!isEditing}
            sx={{ bgcolor: isEditing ? 'white' : '#f0f0f0' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={!isEditing}
            sx={{ bgcolor: isEditing ? 'white' : '#f0f0f0' }}
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