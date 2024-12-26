package com.example.satPractice.service;

import com.example.satPractice.dto.RegisterDTO;
import com.example.satPractice.exception.EmailAlreadyInUseException;
import com.example.satPractice.exception.UsernameAlreadyTakenException;
import com.example.satPractice.model.Admin;
import com.example.satPractice.model.Role;
import com.example.satPractice.repository.AdminRepository;
import com.example.satPractice.repository.RoleRepository;
import com.example.satPractice.repository.UserRepository;
import com.example.satPractice.util.EmailUtil;
import com.example.satPractice.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OtpUtil otpUtil;
    private final EmailUtil emailUtil;
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;

    private static final String ADMIN_ROLE_NAME = "ADMIN";
    private static final String EMAIL_IN_USE_MSG = "Email is already in use.";
    private static final String USERNAME_TAKEN_MSG = "Username is already taken.";
    private static final int OTP_EXPIRATION_MINUTES = 15;

    public String registerAdmin(RegisterDTO registerDTO, PasswordEncoder passwordEncoder) throws MessagingException {
        if (userRepository.findByEmail(registerDTO.getEmail()) != null) {
            throw new EmailAlreadyInUseException(EMAIL_IN_USE_MSG);
        }

        if (userRepository.findByUsername(registerDTO.getUsername()) != null) {
            throw new UsernameAlreadyTakenException(USERNAME_TAKEN_MSG);
        }

        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(registerDTO.getEmail(), otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send verification email. Please try again.", e);
        }

        Admin admin = new Admin();
        admin.setUsername(registerDTO.getUsername());
        admin.setEmail(registerDTO.getEmail());
        admin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        admin.setOtp(otp);
        admin.setEnabled(false);
        admin.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES));

        Role role = roleRepository.findByName(ADMIN_ROLE_NAME);
        admin.setRole(role);

        adminRepository.save(admin);
        return "User registered successfully! Please verify your email.";
    }
    public Admin getAdminInfo(String username) {
        return adminRepository.findByUsername(username);
    }

}