package com.example.satPractice.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Setter
@Getter
@NoArgsConstructor
@Component
public class EditInfo {
    private String firstName;
    private String lastName;
    private String username;
}
