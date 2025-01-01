package com.example.satPractice.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class BaseQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000) // Specify a length greater than 255
    private String text;

    @Column(length = 1000) // Specify a length greater than 255
    private String optionA;

    @Column(length = 1000) // Specify a length greater than 255
    private String optionB;

    @Column(length = 1000) // Specify a length greater than 255
    private String optionC;

    @Column(length = 1000) // Specify a length greater than 255
    private String optionD;

    @Column(length = 1000) // Specify a length greater than 255
    private String correctAnswer;

    @Column(length = 1000) // Specify a length greater than 255
    private String explanation;

    @Column(length = 1000) // Specify a length greater than 255
    private String difficulty;
}