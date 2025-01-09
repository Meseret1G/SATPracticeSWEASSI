import React from "react";
import { Typography, Box, Card, CardContent, List, ListItem, ListItemText, Button } from "@mui/material";
import { AccessTime, Assignment, Payment, Info } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AboutSAT = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/student/dashboard");
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Button variant="outlined" onClick={handleBack} sx={{ marginBottom: "20px" }}>
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom align="center">
        About SAT
      </Typography>
      
      <Card sx={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            The SAT (Scholastic Assessment Test) is a standardized college admission test widely used in the United States. Developed by the College Board, the SAT assesses students' readiness for college and provides colleges with a common data point to compare applicants.
          </Typography>
          
          <Typography variant="h5" gutterBottom>
            Key Features of the SAT:
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Purpose:</strong> The SAT is designed to measure literacy, numeracy, and writing skills. It evaluates a student’s ability to analyze and solve problems, which are essential skills for success in college.
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Structure:</strong> The SAT consists of three main sections:
          </Typography>
          <List>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Evidence-Based Reading and Writing:</strong>} secondary="This section includes reading comprehension questions based on passages and a writing and language section that assesses grammar and usage." />
            </ListItem>
            <ListItem>
              <AccessTime fontSize="small" />
              <ListItemText primary={<strong>Math:</strong>} secondary="The math section covers a range of topics, including algebra, problem-solving, data analysis, and advanced math concepts." />
            </ListItem>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Essay (Optional):</strong>} secondary="The SAT also offers an optional essay section, where students analyze a provided text and articulate their reasoning." />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            <strong>Scoring:</strong> The SAT is scored on a scale of 400 to 1600, combining the scores from the Evidence-Based Reading and Writing and Math sections. The optional essay is scored separately.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Registration Process
          </Typography>
          <List>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Create an Account:</strong>} secondary="Visit the College Board website, click on 'Register for the SAT,' and create an account by providing your email address, creating a password, and entering your personal information." />
            </ListItem>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Select Test Date and Location:</strong>} secondary="Choose a suitable test date from the available options and select a test center in Ethiopia." />
            </ListItem>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Complete Personal Information:</strong>} secondary="Fill out your personal details, including name, address, date of birth, and high school information. Ensure that all information matches your identification documents." />
            </ListItem>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Choose Your SAT Test Type:</strong>} secondary="Decide if you will take the standard SAT or the SAT with Essay (if available)." />
            </ListItem>
            <ListItem>
              <Assignment fontSize="small" />
              <ListItemText primary={<strong>Add Additional Services (Optional):</strong>} secondary="Consider adding services like sending your scores to colleges or selecting specific accommodations if needed." />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Payment Process
          </Typography>
          <List>
            <ListItem>
              <Payment fontSize="small" />
              <ListItemText primary={<strong>Review Your Registration:</strong>} secondary="Check all the information you provided, including test date, location, and personal details." />
            </ListItem>
            <ListItem>
              <Payment fontSize="small" />
              <ListItemText primary={<strong>Select Payment Method:</strong>} secondary="Choose your payment method, which may include credit/debit cards or other online payment options." />
            </ListItem>
            <ListItem>
              <Payment fontSize="small" />
              <ListItemText primary={<strong>Make the Payment:</strong>} secondary="Enter your payment details and review the total cost, which includes the registration fee and any additional services selected." />
            </ListItem>
            <ListItem>
              <Payment fontSize="small" />
              <ListItemText primary={<strong>Confirmation:</strong>} secondary="After successful payment, you will receive a confirmation email with your registration details and a receipt." />
            </ListItem>
            <ListItem>
              <Payment fontSize="small" />
              <ListItemText primary={<strong>Print Admission Ticket:</strong>} secondary="Closer to the test date, log in to your College Board account to print your admission ticket, which you must bring on test day." />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Important Notes
          </Typography>
          <List>
            <ListItem>
              <Info fontSize="small" />
              <ListItemText primary="Registration Deadlines: Be aware of registration deadlines to ensure you secure your spot for the desired test date." />
            </ListItem>
            <ListItem>
              <Info fontSize="small" />
              <ListItemText primary="Fee Waivers: If you qualify, check for fee waiver options available for eligible students." />
            </ListItem>
            <ListItem>
              <Info fontSize="small" />
              <ListItemText primary="Identification: On test day, bring a valid ID that matches the name you used during registration." />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AboutSAT;