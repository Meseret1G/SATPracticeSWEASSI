package com.example.satPractice.controller;

import com.example.satPractice.dto.*;
import com.example.satPractice.model.Student;
import com.example.satPractice.model.User;
import com.example.satPractice.repository.StudentRepository;
import com.example.satPractice.service.JwtService;
import com.example.satPractice.service.StudentService;
import com.example.satPractice.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@Valid @RequestBody RegisterDTO registerDTO) {
        String response;
        try {
            response = studentService.registerStudent(registerDTO, passwordEncoder); // Pass PasswordEncoder
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending verification email: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    @PostMapping("/studentInfo")
    public ResponseEntity<String> studentInfo(@Valid @RequestBody StudentInfoDTO studentInfoDTO, HttpServletRequest request) {
        String response;

        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                String username = jwtService.extractUsername(token);
                System.out.println("Extracted username: " + username); // Debugging

                response = studentService.studentInfo(studentInfoDTO, username);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header is missing or invalid.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/s_info")
    public ResponseEntity<?> getStudentInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }

        String username = authentication.getName();

        StudentInfo userInfo = studentService.getUserByUsername(username);

        if (userInfo == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(userInfo);
    }
    @PutMapping("/edit")
    public ResponseEntity<User> editUserInfo(@RequestBody EditInfo editInfo) {
        Student updatedUser  = studentService.editUserInfo(editInfo);
        if (updatedUser  != null) {
            return ResponseEntity.ok(updatedUser );
        }
        return ResponseEntity.notFound().build(); // Return 404 if user not found
    }
}




