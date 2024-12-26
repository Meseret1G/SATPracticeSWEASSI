package com.example.satPractice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EnglishQuestion extends BaseQuestion {
    private String questionType;

    @ManyToOne
    @JoinColumn(name = "question_set_id")
    @JsonBackReference
    private QuestionSet questionSet;
    public Long getQuestionSetId() {
        return questionSet != null ? questionSet.getId() : null;
    }
}
