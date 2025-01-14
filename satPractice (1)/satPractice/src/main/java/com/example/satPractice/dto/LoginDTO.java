package com.example.satPractice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginDTO {
    @NotBlank(message="Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;


}
