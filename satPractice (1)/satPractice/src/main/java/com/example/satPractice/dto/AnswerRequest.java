package com.example.satPractice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    private Long studentId;
    private Long questionId;
    private String questionSetTitle;
    private String selectedAnswer;

}