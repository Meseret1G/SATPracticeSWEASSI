import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Toolbar,
  Typography,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openPractice, setOpenPractice] = useState(false);
  const [user, setUser ] = useState(null); 
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [messageType, setMessageType] = useState(''); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMath, setOpenMath] = useState(false);
  const [openEnglish, setOpenEnglish] = useState(false);

  const mathQuestionSets = [
    { id: 1, title: "Algebra" },
    { id: 2, title: "Geometry" },
  ];

  const englishQuestionSets = [
    { id: 3, title: "Grammar" },
    { id: 4, title: "Reading" },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setMessage("You must be logged in to access this information.");
        setMessageType('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const username = decodedToken.sub;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/admin/admin_info/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert('Session expired. Please log in again.');
          setTimeout(() => {
  navigate('/login'); 
}, 3000);
        } else {
          setMessage(err.response ? err.response.data : "An error occurred. Please try again.");
        setMessageType('error');
        setSnackbarOpen(true);
        }
        
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("No token found. You are not logged in.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      sessionStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        setTimeout(() => {
        navigate('/login'); 
        }, 3000);
      } else {
        alert("Logout failed. Please try again.");
      }
     
    }
  };

  // const handleAddAdmin = async () => {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     alert("No token found. You are not logged in.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:8080/admin/register', {
  //       username: adminUsername,
  //       email: adminEmail,
  //       password: adminPassword
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setMessage(response.data);
  //     setMessageType('success');
  //     setSnackbarOpen(true);
  //     setIsVerifying(true);
  //     setAdminUsername('');
  //     setAdminPassword('');
  //     setOtp('');
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       alert('Session expired. Please log in again.');
  //       setTimeout(() => {
  //       navigate('/login'); 
  //       }, 3000);
  //     } else {
  //       setMessage(error.response ? error.response.data : "Failed to add admin. Please try again.");
  //     setMessageType('error');
  //     setSnackbarOpen(true);
  //     }
      
  //   }
  // };

  // const handleVerifyAccount = async () => {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     alert("No token found. You are not logged in.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:8080/verifyAccount', {
  //       email: adminEmail,
  //       otp: otp
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setMessage(response.data);
  //     setMessageType('success');
  //     setSnackbarOpen(true);
  //     setIsVerifying(false);
  //     setOtp('');
  //   } catch (error) {
  //     setMessage(error.response ? error.response.data : "Failed to verify account. Please try again.");
  //     setMessageType('error');
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleAddPracticeQuestions = () => {
    setOpen(!open);
  };

  const handleNavigate = (type) => {
    if (type === 'MATH') {
      navigate('/add-math-questions');
    } else if (type === 'ENGLISH') {
      navigate('/add-english-questions');
    }
  };

  const handleMathTopicNavigate = (topic) => {
    navigate(`/math-questions/${topic}`);
  };

  const handleEnglishTopicNavigate = (topic) => {
    navigate(`/english-questions/${topic}`);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <CssBaseline />
      <AppBar position="static" color="primary" >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {/* <Button color="inherit" startIcon={<SettingsIcon />} onClick={() => setSettingsOpen(!settingsOpen)}>
            Settings
          </Button> */}
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
  <Box sx={{ width: 250, padding: 2}}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
      Admin Menu
    </Typography>
    <Divider />
    <List>
      <ListItem button onClick={toggleDrawer}>
        <DashboardIcon sx={{ marginRight: 1 }} />
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button onClick={handleAddPracticeQuestions}>
        <AddIcon sx={{ marginRight: 1 }} />
        <ListItemText primary="Add Practice Questions" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button onClick={() => handleNavigate('MATH')} sx={{ pl: 4 }}>
            <ListItemText primary="Math" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('ENGLISH')} sx={{ pl: 4 }}>
            <ListItemText primary="English" />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button onClick={() => setOpenPractice(!openPractice)}>
        <AssignmentIcon sx={{ marginRight: 1 }} />
        <ListItemText primary="Practice Questions" />
        {openPractice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={openPractice} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton onClick={() => setOpenMath(!openMath)}>
            <ListItemText primary="Math Question Sets" />
            {openMath ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openMath} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {mathQuestionSets.map((set) => (
                <ListItem key={set.id} onClick={() => handleMathTopicNavigate(set.title)} sx={{ pl: 8 }}>
                  <ListItemText primary={set.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItemButton onClick={() => setOpenEnglish(!openEnglish)}>
            <ListItemText primary="English Question Sets" />
            {openEnglish ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openEnglish} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {englishQuestionSets.map((set) => (
                <ListItem key={set.id} onClick={() => handleEnglishTopicNavigate(set.title)} sx={{ pl: 8 }}>
                  <ListItemText primary={set.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Collapse>

      {/* <ListItem button onClick={toggleDrawer}>
        <ReportIcon sx={{ marginRight: 1 }} />
        <ListItemText primary="Reports" />
      </ListItem> */}
    </List>
  </Box>
</Drawer>

{/* FOR FUTURE !!! */}

      {/* <Drawer anchor="top" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <Box sx={{ width: '100%', padding: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            User Information
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading user information...</Typography>
          ) : user ? (
            <>
              <Typography variant="body1">Name: {user.username}</Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
            </>
          ) : (
            <Typography variant="body1">No user information available.</Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">{isVerifying ? "Verify Account" : "Add Admin"}</Typography>
          {!isVerifying ? (
            <>
              <TextField
                label="Admin Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Admin Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleAddAdmin}>
                Add Admin
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                value={adminEmail}
                disabled
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleVerifyAccount}>
                Verify Account
              </Button>
            </>
          )}
          <Typography 
            variant="body1" 
            sx={{ 
              color: messageType === 'success' ? 'green' : 'red', 
              marginTop: 2 
            }}>
            {message}
          </Typography>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={message}
          />
        </Box>
      </Drawer> */}

      <Box flexGrow={1} p={2} sx={{ bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Admin Dashboard!
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575' }}>
          Here you can manage users, view reports, and configure settings.
        </Typography>

        <Box mt={3} display="flex" justifyContent="space-around">
          <Card sx={{ width: 300, bgcolor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Manage all user accounts and settings.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 300, bgcolor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Reports
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                View and analyze user activity reports.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 300, bgcolor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Settings
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Configure application settings and preferences.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;