package com.example.satPractice.exception;

public class QuestionAlreadyExistsException extends RuntimeException {
    public QuestionAlreadyExistsException(String message) {
        super(message);
    }
}
