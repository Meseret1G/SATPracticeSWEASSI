package com.example.satPractice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegenerateOTPDTO {
    @NotBlank(message = "email is required")
    @Email
    private String email;

}
