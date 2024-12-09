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
  Rating,
  Avatar,
  Card,
  CardContent,
  Grid,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
  Collapse,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpOutline from '@mui/icons-material/HelpOutline';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openPractice, setOpenPractice] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("No token found. You are not logged in.");
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
        alert("Logout failed. Please try again.");
    }
};
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleInfoDrawer = () => {
    setInfoDrawerOpen(!infoDrawerOpen);
  };

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
      alert("Failed to fetch user information."); 
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleProfileClick = () => {
    toggleDrawer();
    toggleInfoDrawer();
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
          setDialogOpen(true); 
          setTimeout(() => {
            setDialogOpen(false);
            navigate('/student/dashboard'); 
          }, 1000);
        } else {
          console.error("Failed to update user info");
          alert("Failed to update user information."); 
        }
      } catch (error) {
        console.error("Error saving user info:", error);
        alert("Failed to save user information. Please try again.");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" sx={{ margin: 2, backgroundColor: '#f0f0f0' }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Student Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box sx={{ width: 250, padding: 2, bgcolor: '#e3f2fd' }}>
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
              <ListItem button onClick={toggleDrawer}>
                <HomeIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={handleProfileClick}>
                <AccountCircle sx={{ marginRight: 1 }} />
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={() => setOpenPractice(!openPractice)}>
                <ListItemText primary="Practice" />
                {openPractice ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openPractice} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button sx={{ pl: 4 }}>
                    <ListItemText primary="Practice 1" />
                  </ListItem>
                  <ListItem button sx={{ pl: 4 }}>
                    <ListItemText primary="Practice 2" />
                  </ListItem>
                </List>
              </Collapse>
              <ListItem button onClick={() => setOpenQuiz(!openQuiz)}>
                <ListItemText primary="Quiz" />
                {openQuiz ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openQuiz} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button sx={{ pl: 4 }}>
                    <ListItemText primary="Quiz 1" />
                  </ListItem>
                  <ListItem button sx={{ pl: 4 }}>
                    <ListItemText primary="Quiz 2" />
                  </ListItem>
                </List>
              </Collapse>
              <ListItem button onClick={toggleDrawer}>
                <HelpOutline sx={{ marginRight: 1 }} />
                <ListItemText primary="About SAT" />
              </ListItem>
              <ListItem button onClick={toggleDrawer}>
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

        <Slide direction="left" in={infoDrawerOpen} mountOnEnter unmountOnExit>
          <Drawer
            anchor="right"
            open={infoDrawerOpen}
            onClose={toggleInfoDrawer}
            variant={isMobile ? 'temporary' : 'persistent'}
            sx={{
              '& .MuiDrawer-paper': {
                width: 320,
                padding: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                borderTopLeftRadius: '16px',
                borderBottomLeftRadius: '16px',
                top: 0,
                bottom: 0,
                height: '100%',
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
              <IconButton onClick={toggleInfoDrawer}>
                <CloseIcon />
              </IconButton>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ marginRight: 0.5, color: '#333', fontWeight: 'bold' }}>
                  {user ? user.username : 'Loading...'}
                </Typography>
                <Avatar sx={{ fontSize: 48, bgcolor: '#3f51b5', boxShadow: 2, border: '2px solid #ffffff' }} />
              </Box>
            </Box>
            <Divider sx={{ margin: '16px 0' }} />
            <Stack spacing={2} p={2}>
              {user ? (
                <>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    disabled={!isEditing}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    disabled={!isEditing}
                  />
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    disabled={!isEditing}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    onClick={handleEditClick}
                    sx={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 2, 
                      bgcolor: '#3f51b5', 
                      borderRadius: '8px', 
                      padding: '10px 20px', 
                      '&:hover': { 
                        bgcolor: '#2c387e', 
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', 
                      },
                      fontWeight: 'bold', 
                    }}
                  >
                    {isEditing ? 'Save Information' : 'Edit Information'}
                  </Button>
                </>
              ) : (
                <Typography variant="body1" sx={{ color: '#757575' }}>Loading user info...</Typography>
              )}
            </Stack>
          </Drawer>
        </Slide>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{"Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your information has been successfully saved!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;