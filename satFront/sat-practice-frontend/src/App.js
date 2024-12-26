import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm'; 
import VerifyAccountForm from './components/VerifyAccountForm'; 
import ResetPassword from './components/ResetPassword'; 
import StudentDashboard from './components/StudentDashboard'; 
import AdminDashboard from './components/AdminDashboard'; 
import ForgotPassword from './components/ForgotPassword';
import VerifyAccountReset from './components/VerifyAccountReset';
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

function App() {
    return (
        <Router>
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/verify-account" element={<VerifyAccountForm />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/add-math-questions" element={<MathQuestion />} />
                    <Route path="/add-english-questions" element={<EnglishQuestion />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-account-reset" element={<VerifyAccountReset />} />
                    <Route path="/student/student-info" element={<StudentInfoForm />} />
                    <Route path="/english-questions/:topic" element={<DisplayEnglishQuestions />} />
                    <Route path="/math-questions/:topic" element={<DisplayMathQuestions />} />
                    <Route path="/math-question-set" element={<MathQuestionSet />} />
                    <Route path="/english-question-set" element={<EnglishQuestionSet />} />
                    <Route path="/questionSet/:title" element={<QuestionAnswering />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;