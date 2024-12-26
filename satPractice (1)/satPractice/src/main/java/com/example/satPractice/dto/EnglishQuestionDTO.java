package com.example.satPractice.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EnglishQuestionDTO {
    private Long id;
    private String text;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    private String explanation;
    private String difficulty;
    private String questionType;
    private String questionSetName;
}

