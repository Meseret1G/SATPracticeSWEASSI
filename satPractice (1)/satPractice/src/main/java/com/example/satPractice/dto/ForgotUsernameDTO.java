package com.example.satPractice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class ForgotUsernameDTO {

    @NotEmpty(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}