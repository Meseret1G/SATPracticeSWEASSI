package com.example.satPractice.controller;

import com.example.satPractice.dto.*;
import com.example.satPractice.service.AdminService;
import com.example.satPractice.service.JwtService;
import com.example.satPractice.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.example.satPractice.service.TokenBlacklistService;
import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
@RequestMapping("/")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
@Autowired
private JwtService jwtService;
@Autowired
private TokenBlacklistService tokenBlacklistService;
    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginDTO loginDTO) {
        try {
            Map<String, Object> loginResponse = userService.loginUser(loginDTO);

            // Ensure all values in the response map are strings
            return ResponseEntity.ok(loginResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/verifyAccount")
    public ResponseEntity<String> verifyAccount(@Valid @RequestBody VerifyAccountDTO verifyAccountDTO) {
        String response = userService.verifyAccount(verifyAccountDTO);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/verifyAccountReset")
    public ResponseEntity<String> verifyAccountReset(@Valid @RequestBody VerifyAccountDTO verifyAccountDTO) {
        String response = userService.verifyAccountReset(verifyAccountDTO);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/regenerateOtp")
    public ResponseEntity<String> regenerateOtp(@Valid @RequestBody RegenerateOTPDTO regenerateOTPDTO) {
        try {
            return new ResponseEntity<>(userService.regenerateOtp(regenerateOTPDTO.getEmail()), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        logger.info("Reset password request received for OTP: {}", resetPasswordDTO.getOtp());
        try {
            return new ResponseEntity<>(userService.resetPassword(resetPasswordDTO), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error during password reset: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            return new ResponseEntity<>(userService.forgotPassword(forgotPasswordDTO.getEmail()), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader){
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
            tokenBlacklistService.blacklistToken(token); // Blacklist the token
        }
        return ResponseEntity.ok("Logout successful. Please delete the token on the client side.");
    }

}
