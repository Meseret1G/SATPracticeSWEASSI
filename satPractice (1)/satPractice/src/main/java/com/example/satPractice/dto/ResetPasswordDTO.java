package com.example.satPractice.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResetPasswordDTO {

    @NotEmpty(message = "OTP is required")
    private String otp;

    @Getter
    @NotEmpty(message = "New password is required")
    private String newPassword;

    public String getOtp() {
        return otp;
    }




}
