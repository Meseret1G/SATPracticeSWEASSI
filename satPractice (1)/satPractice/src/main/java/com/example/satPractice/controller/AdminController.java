package com.example.satPractice.controller;

import com.example.satPractice.dto.RegisterDTO;
import com.example.satPractice.model.Admin;
import com.example.satPractice.service.AdminService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody RegisterDTO registerDTO) {
        String response;
        try {
            response = adminService.registerAdmin(registerDTO, passwordEncoder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending verification email: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    @GetMapping("/admin_info/{username}")
    public ResponseEntity<Admin> getAdminInfo(@PathVariable String username) {
        Admin admin = adminService.getAdminInfo(username);
        if (admin == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(admin);
    }
}
