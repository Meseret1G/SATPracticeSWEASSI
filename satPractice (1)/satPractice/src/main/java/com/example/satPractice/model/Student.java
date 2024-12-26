package com.example.satPractice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@DiscriminatorValue("STUDENT")
public class Student extends User {

    private String firstName;
    private String lastName;

    private int targetScore;
    private int quizzesAttempted;
    private float percentScore;
    private int missedAnswers;
    private int answeredQuestions;

    // for future
    @ElementCollection
    private List<MissedQuestion> missedQuestions = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "student_completed_question_sets",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "question_set_id")
    )
    private List<QuestionSet> completedQuestionSets = new ArrayList<>();

    // for future
    public void calculatePercentScore() {
        if (quizzesAttempted > 0) {
            this.percentScore = (float) answeredQuestions / (answeredQuestions + missedAnswers) * 100;
        }
    }

    public void markQuestionSetCompleted(QuestionSet questionSet) {
        if (!completedQuestionSets.contains(questionSet)) {
            completedQuestionSets.add(questionSet);
        }
    }
}

