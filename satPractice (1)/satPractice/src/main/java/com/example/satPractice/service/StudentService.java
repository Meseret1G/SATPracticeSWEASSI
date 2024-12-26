package com.example.satPractice.service;

import com.example.satPractice.dto.EditInfo;
import com.example.satPractice.dto.RegisterDTO;
import com.example.satPractice.dto.StudentInfo;
import com.example.satPractice.dto.StudentInfoDTO;
import com.example.satPractice.model.Role;
import com.example.satPractice.model.Student;
import com.example.satPractice.repository.AdminRepository;
import com.example.satPractice.repository.RoleRepository;
import com.example.satPractice.repository.StudentRepository;
import com.example.satPractice.repository.UserRepository;
import com.example.satPractice.util.EmailUtil;
import com.example.satPractice.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@NoArgsConstructor
@AllArgsConstructor
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private JwtService jwtService;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private EmailUtil emailUtil;
    @Autowired
    private OtpUtil otpUtil;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerStudent(RegisterDTO registerDTO, PasswordEncoder passwordEncoder) throws MessagingException {
        if (userRepository.findByEmail(registerDTO.getEmail()) != null) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        if (userRepository.findByUsername(registerDTO.getUsername()) != null) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(registerDTO.getEmail(), otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send verification email. Please try again.");
        }

        Student student = new Student();
        student.setUsername(registerDTO.getUsername());
        student.setEmail(registerDTO.getEmail());
        student.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        student.setOtp(otp);
        student.setEnabled(false);
        student.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        Role role = roleRepository.findByName("STUDENT");
        student.setRole(role);
        studentRepository.save(student);
        return "User registered successfully! Please verify your email.";
    }

    public String studentInfo(StudentInfoDTO studentInfoDTO, String username) {
        System.out.println("Updating info for student: " + username);
        System.out.println("New first name: " + studentInfoDTO.getFirstName());
        System.out.println("New last name: " + studentInfoDTO.getLastName());
        System.out.println("New target score: " + studentInfoDTO.getTargetScore());

        Student student = studentRepository.findByUsername(username);

        if (student == null) {
            throw new IllegalArgumentException("Student not found");
        }

        student.setFirstName(studentInfoDTO.getFirstName());
        student.setLastName(studentInfoDTO.getLastName());

        if (studentInfoDTO.getTargetScore() > 1600) {
            throw new IllegalArgumentException("The target score can't be greater than 1600");
        } else {
            student.setTargetScore(studentInfoDTO.getTargetScore());
        }

        studentRepository.save(student);
        return "Congratulations, Have fun!!";
    }

    public StudentInfo getUserByUsername(String username) {
        Student student = studentRepository.findByUsername(username);
        if (student != null) {
            return new StudentInfo(student);
        }
        return null;
    }

    public Student editUserInfo(EditInfo editInfo) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Student user = studentRepository.findByUsername(username);
        if (user != null) {
            user.setFirstName(editInfo.getFirstName());
            user.setLastName(editInfo.getLastName());
            user.setUsername(editInfo.getUsername());
            return userRepository.save(user);
        }
        return null;
    }
}