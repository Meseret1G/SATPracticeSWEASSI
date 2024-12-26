package com.example.satPractice.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class MissedQuestion {
    private Long questionId;
    private String questionSetTitle;

    public MissedQuestion() {}

    public MissedQuestion(Long questionId, String questionSetTitle) {
        this.questionId = questionId;
        this.questionSetTitle = questionSetTitle;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionSetTitle() {
        return questionSetTitle;
    }

    public void setQuestionSetTitle(String questionSetTitle) {
        this.questionSetTitle = questionSetTitle;
    }
}