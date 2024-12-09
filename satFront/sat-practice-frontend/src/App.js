import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm'; 
import VerifyAccountForm from './components/VerifyAccountForm'; 
import ResetPassword from './components/ResetPassword'; 
import StudentDashboard from './components/StudentDashboard'; 
import ForgotPassword from './components/ForgotPassword';
import VerifyAccountReset from './components/VerifyAccountReset';
import HomePage from './components/HomePage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentInfoForm from './components/StudentInfoForm';
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet"></link>
function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/verify-account" element={<VerifyAccountForm />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-account-reset" element={<VerifyAccountReset />} />
                <Route path="/student/student-info" element={<StudentInfoForm />} />
            </Routes>
        </Router>
    );
}

export default App;