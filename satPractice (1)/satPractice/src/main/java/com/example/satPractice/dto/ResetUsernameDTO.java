package com.example.satPractice.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;

public class ResetUsernameDTO {
    @NotEmpty(message = "OTP is required")
    private String otp;

    @Getter
    @NotEmpty(message = "New password is required")
    private String newUsername;

    public String getOtp() {
        return otp;
    }
}
