package com.example.satPractice.service;

import com.example.satPractice.dto.ResetPasswordDTO;
import com.example.satPractice.dto.ResetUsernameDTO;
import com.example.satPractice.dto.VerifyAccountDTO;
import com.example.satPractice.model.Admin;
import com.example.satPractice.model.Student;
import com.example.satPractice.model.User;
import com.example.satPractice.dto.LoginDTO;
import com.example.satPractice.repository.AdminRepository;
import com.example.satPractice.repository.StudentRepository;
import com.example.satPractice.repository.UserRepository;
import com.example.satPractice.util.EmailUtil;
import com.example.satPractice.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;
@Autowired
private OtpUtil otpUtil;
@Autowired
private EmailUtil emailUtil;
    @Autowired
    private JwtService jwtService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            user = userRepository.findByEmail(username);
        }

        if (user == null) {
            throw new UsernameNotFoundException("User  not found with username or email: " + username);
        }

        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName());

        logger.debug("Authority for user {}: {}", username, authority);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }


    public Map<String, Object> loginUser(LoginDTO loginDTO) {
        User user = adminRepository.findByUsername(loginDTO.getUsername());
        if (user == null) {
            user = studentRepository.findByUsername(loginDTO.getUsername());
        }

        if (user == null) {
            logger.warn("Login attempt with invalid username: {}", loginDTO.getUsername());
            throw new IllegalArgumentException("Invalid Username.");
            //return Map.of("error", "Invalid credentials.");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            logger.warn("Invalid password attempt for user: {}", loginDTO.getUsername());
            throw new IllegalArgumentException("Invalid password.");
        }
        if (!user.isEnabled()) {
            throw new IllegalArgumentException("Your account is not verified.");

            //return Map.of("error", );
        }
        boolean isFirstLogin = user.isFirstLogin();
        if (isFirstLogin) {
            user.setFirstLogin(false);
            userRepository.save(user);
            logger.info("User {} logged in for the first time.", user.getUsername());
        }


        Set<String> roles = new HashSet<>();
        roles.add(user.getRole().getName());

        String jwt = jwtService.generateToken(user.getUsername(), roles);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login succeZssful");
        response.put("token", jwt);
        response.put("role", user.getRole().getName());
        response.put("isFirstLogin", isFirstLogin);
        return response;
    }

    public String verifyAccount(VerifyAccountDTO verifyAccountDTO) {
        String email = verifyAccountDTO.getEmail();
        String otp = verifyAccountDTO.getOtp();

        Admin admin = adminRepository.findByEmail(email);
        Student student = null;
        if (admin == null) {
            student = studentRepository.findByEmail(email);
        }

        if (admin == null && student == null) {
            return "User not found with this email: " + email;
        }

        Object user = (admin != null) ? admin : student;

        logger.info("Current time: {}", LocalDateTime.now());
        logger.info("Expiration time: {}", (user instanceof Admin ? ((Admin) user).getVerificationCodeExpiresAt() : ((Student) user).getVerificationCodeExpiresAt()));

        LocalDateTime expirationTime = (user instanceof Admin) ? ((Admin) user).getVerificationCodeExpiresAt() : ((Student) user).getVerificationCodeExpiresAt();
        if (expirationTime == null || expirationTime.isBefore(LocalDateTime.now())) {
            return "OTP has expired. Please regenerate OTP.";
        }

        boolean isOtpValid = (user instanceof Admin && ((Admin) user).getOtp() != null && ((Admin) user).getOtp().trim().equals(otp.trim())) ||
                (user instanceof Student && ((Student) user).getOtp() != null && ((Student) user).getOtp().trim().equals(otp.trim()));

        logger.info("OTP entered: '{}', Stored OTP: '{}', Is valid: {}", otp, (user instanceof Admin ? ((Admin) user).getOtp() : ((Student) user).getOtp()), isOtpValid);

        if (isOtpValid) {
            if (user instanceof Admin) {
                Admin verifiedAdmin = (Admin) user;
                verifiedAdmin.setEnabled(true);
                verifiedAdmin.setOtp(null);
                verifiedAdmin.setVerificationCodeExpiresAt(null);
                adminRepository.save(verifiedAdmin);
                logger.info("Admin user enabled: {}", verifiedAdmin.isEnabled());
            } else if (user instanceof Student) {
                Student verifiedStudent = (Student) user;
                verifiedStudent.setEnabled(true);
                verifiedStudent.setOtp(null);
                verifiedStudent.setVerificationCodeExpiresAt(null);
                studentRepository.save(verifiedStudent);
                logger.info("Student user enabled: {}", verifiedStudent.isEnabled());
            }
            return "OTP verified. You can log in.";
        }

        return "Invalid OTP. Please try again.";
    }

    public String verifyAccountReset(VerifyAccountDTO verifyAccountDTO) {
        String email = verifyAccountDTO.getEmail();
        String otp = verifyAccountDTO.getOtp();

        Admin admin = adminRepository.findByEmail(email);
        Student student = null;
        if (admin == null) {
            student = studentRepository.findByEmail(email);
        }

        if (admin == null && student == null) {
            return "User not found with this email: " + email;
        }

        User user = (admin != null) ? admin : student;

        if (user.getPasswordResetToken() == null ||
                !user.getPasswordResetToken().trim().equals(otp.trim()) ||
                user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            return "Invalid or expired OTP. Please try again.";
        }


        userRepository.save(user);

        return "OTP verified successfully. You can now reset your password.";
    }
    public String regenerateOtp(String email) {
        Admin admin = adminRepository.findByEmail(email);
        Student student = null;
        if (admin == null) {
            student = studentRepository.findByEmail(email);
        }

        if (admin == null && student == null) {
            return "User not found with this email: " + email;
        }

        User user = (admin != null) ? admin : student;

        if (user.getPasswordResetToken() != null && user.getResetOtpExpiresAt().isAfter(LocalDateTime.now())) {
            return "A valid OTP already exists. Please use the existing OTP.";
        }

        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(email, otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send OTP. Please try again.");
        }

        user.setPasswordResetToken(otp);
        user.setResetOtpExpiresAt(LocalDateTime.now().plusMinutes(15));
        if (admin != null) {
            adminRepository.save(admin);
        } else {
            studentRepository.save(student);
        }

        return "Email sent. Please verify the account within 15 minutes.";
    }
    public String handleForgotOtp(String email) throws MessagingException {
        Admin admin = adminRepository.findByEmail(email);
        Student student = null;

        if (admin == null) {
            student = studentRepository.findByEmail(email);
        }

        if (admin == null && student == null) {
            return "User not found with this email: " + email;
        }

        User user = (admin != null) ? admin : student;

        if (user.getPasswordResetToken() != null && user.getResetOtpExpiresAt().isAfter(LocalDateTime.now())) {
            return "A valid OTP already exists. Please use the existing OTP.";
        }

        String otp = otpUtil.generateOtp();
        user.setPasswordResetToken(otp);
        user.setResetOtpExpiresAt(LocalDateTime.now().plusMinutes(15));

        // Save the updated user
        if (admin != null) {
            adminRepository.save(admin);
        } else {
            studentRepository.save(student);
        }

        // Send OTP email
        emailUtil.sendOtpEmail(email, otp);
        return "OTP sent to your email.";
    }

    public String forgotUsername(String email) throws MessagingException {
        return handleForgotOtp(email);
    }

    public String forgotPassword(String email) throws MessagingException {
        return handleForgotOtp(email);
    }


    public String resetUsername(ResetUsernameDTO resetUsernameDTO){
        String otp = resetUsernameDTO.getOtp();
        String newUsername = resetUsernameDTO.getNewUsername();
        User user = userRepository.findByPasswordResetToken(otp);
        if(user == null){
            throw  new IllegalArgumentException("Invalid OTP");
        }
        if (user.getResetOtpExpiresAt() == null || user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }
        user.setUsername(newUsername);
        user.setPasswordResetToken(null);
        user.setResetOtpExpiresAt(null);
        userRepository.save(user);
        return "username has been reset successfully";
    }
    public String resetPassword(ResetPasswordDTO resetPasswordDTO) {
        String otp = resetPasswordDTO.getOtp();
        String newPassword = resetPasswordDTO.getNewPassword();

        User user = userRepository.findByPasswordResetToken(otp);

        if (user == null) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        if (user.getResetOtpExpiresAt() == null || user.getResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setResetOtpExpiresAt(null);
        userRepository.save(user);

        return "Password has been reset successfully.";
    }
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanExpiredUnverifiedAccounts() {
        LocalDateTime now = LocalDateTime.now();
        userRepository.deleteExpiredUnverifiedAccounts(now);
        System.out.println("Expired unverified accounts cleaned up at " + now);
    }
}


