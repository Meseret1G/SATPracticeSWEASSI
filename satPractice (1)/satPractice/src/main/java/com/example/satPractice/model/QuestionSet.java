package com.example.satPractice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;


    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)

    private List<MathQuestion> mathQuestion;

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EnglishQuestion> englishQuestions;


}
