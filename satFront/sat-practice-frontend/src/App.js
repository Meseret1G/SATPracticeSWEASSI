import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { createGlobalStyle } from 'styled-components'; 
import { AppBar, Toolbar, Typography } from '@mui/material';
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm'; 
import VerifyAccountForm from './components/VerifyAccountForm'; 
import ResetPassword from './components/ResetPassword'; 
import ResetUsername from './components/ResetUsername'; 
import AboutSAT from "./components/AboutSAT";
import StudentDashboard from './components/StudentDashboard'; 
import AdminDashboard from './components/AdminDashboard'; 
import ForgotPassword from './components/ForgotPassword';
import ForgotUsername from './components/ForgotUsername';

import VerifyAccountReset from './components/VerifyAccountReset';
import VerifyAccountUsername from './components/VerifyAccountUsername';

import HomePage from './components/HomePage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentInfoForm from './components/StudentInfoForm';
import EnglishQuestion from './components/EnglishQuestion';
import MathQuestion from './components/MathQuestion';
import MathQuestionSet from './components/MathQuestionSet';
import EnglishQuestionSet from './components/EnglishQuestionSet';
import DisplayEnglishQuestions from './components/DisplayEnglishQuestions';
import DisplayMathQuestions from './components/DisplayMathQuestions';
import QuestionAnswering from './components/QuestionPractice';
import MissedQuestionsList from './components/MissedQuestionsList'; 

const GlobalStyle = createGlobalStyle`
   @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
    
    body {
    font-family: 'Inter', sans-serif;
    }
`;
function Header() {
    return (
        <AppBar position="fixed" color="tertiary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ACE SAT
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

function App() {
    return (
        <>
            <GlobalStyle />
            <Router>
            <Header />
            <Container maxWidth="lg" style={{ marginTop: '80px' }}> {/* Adjust marginTop to your header height */}
            <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/verify-account" element={<VerifyAccountForm />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/reset-username" element={<ResetUsername />} />
                        <Route path="/about-sat" element={<AboutSAT />} />
                        <Route path="/student/dashboard" element={<StudentDashboard />} />
                        <Route path="/add-math-questions" element={<MathQuestion />} />
                        <Route path="/add-english-questions" element={<EnglishQuestion />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/forgot-username" element={<ForgotUsername />} />
                        <Route path="/verify-account-reset" element={<VerifyAccountReset />} />
                        <Route path="/verify-account-username" element={<VerifyAccountUsername />} />
                        <Route path="/student/student-info" element={<StudentInfoForm />} />
                        <Route path="/english-questions/:topic" element={<DisplayEnglishQuestions />} />
                        <Route path="/math-questions/:topic" element={<DisplayMathQuestions />} />
                        <Route path="/math-question-set" element={<MathQuestionSet />} />
                        <Route path="/english-question-set" element={<EnglishQuestionSet />} />
                        <Route path="/questionSet/:title" element={<QuestionAnswering />} />
                        <Route path="/missed-questions" element={<MissedQuestionsList />} />
                    </Routes>
                </Container>
            </Router>
        </>
    );
}

export default App;