package com.example.satPractice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class StudentInfoDTO {
    @NotBlank(message = "First name should be filled")
    private String firstName;

    @NotBlank(message = "Last name should be filled")
    private String lastName;

    @NotNull(message = "Target score should not be null")
    @Min(value = 0, message = "Target score must be at least 0") // Ensure targetScore is non-negative
    private Integer targetScore; // Change to Integer to use @NotNull and @Min

   
}