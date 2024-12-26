package com.example.satPractice.service;

import com.example.satPractice.model.*;
import com.example.satPractice.repository.EnglishQuestionRepository;
import com.example.satPractice.repository.MathQuestionRepository;
import com.example.satPractice.repository.QuestionSetRepository;
import com.example.satPractice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionAnsweringService {

    @Autowired
    private QuestionSetRepository questionSetRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MathQuestionRepository mathQuestionRepository;

    @Autowired
    private EnglishQuestionRepository englishQuestionRepository;

    public static class AnswerResponse {
        private boolean isCorrect;
        private String explanation;

        public AnswerResponse(boolean isCorrect, String explanation) {
            this.isCorrect = isCorrect;
            this.explanation = explanation;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public String getExplanation() {
            return explanation;
        }
    }
    public List<QuestionSet> getCompletedQuestionSets(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        return student.getCompletedQuestionSets();
    }

    public void markQuestionSetAsCompleted(Long studentId, Long questionSetId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        QuestionSet questionSet = questionSetRepository.findById(questionSetId)
                .orElseThrow(() -> new IllegalArgumentException("Question set not found"));

        student.markQuestionSetCompleted(questionSet);
        studentRepository.save(student);
    }
    public AnswerResponse answerQuestion(Long studentId, Long questionId, String questionSetTitle, String selectedAnswer) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        QuestionSet questionSet = questionSetRepository.findByTitle(questionSetTitle)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Question set not found"));

        Optional<MathQuestion> mathQuestionOpt = mathQuestionRepository.findById(questionId);
        Optional<EnglishQuestion> englishQuestionOpt = englishQuestionRepository.findById(questionId);

        BaseQuestion question;

        if (mathQuestionOpt.isPresent() && questionSet.getMathQuestion().contains(mathQuestionOpt.get())) {
            question = mathQuestionOpt.get();
        } else if (englishQuestionOpt.isPresent() && questionSet.getEnglishQuestions().contains(englishQuestionOpt.get())) {
            question = englishQuestionOpt.get();
        } else {
            throw new IllegalArgumentException("Question does not belong to the specified question set");
        }

        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

        if (isCorrect) {
            student.setAnsweredQuestions(student.getAnsweredQuestions() + 1);
        } else {
            student.setMissedAnswers(student.getMissedAnswers() + 1);
            student.getMissedQuestions().add(new MissedQuestion(questionId, questionSetTitle));
        }

        student.calculatePercentScore();
        studentRepository.save(student);

        return new AnswerResponse(isCorrect, question.getExplanation());
    }

//for future
    public AnswerResponse reattemptMissedQuestion(Long studentId, Long questionId, String selectedAnswer) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        MissedQuestion missedQuestion = student.getMissedQuestions().stream()
                .filter(mq -> mq.getQuestionId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Question not found in missed questions"));

        Optional<MathQuestion> mathQuestionOpt = mathQuestionRepository.findById(questionId);
        Optional<EnglishQuestion> englishQuestionOpt = englishQuestionRepository.findById(questionId);

        BaseQuestion question;
        if (mathQuestionOpt.isPresent()) {
            question = mathQuestionOpt.get();
        } else if (englishQuestionOpt.isPresent()) {
            question = englishQuestionOpt.get();
        } else {
            throw new IllegalArgumentException("Question not found");
        }

        // Logging question details
        System.out.println("Reattempting Question: " + question.getText() + ", Type: " + question.getClass().getSimpleName());

        // Determine if the selected answer is correct
        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

        // Update student stats based on the answer
        if (isCorrect) {
            student.setAnsweredQuestions(student.getAnsweredQuestions() + 1);
            student.setMissedAnswers(student.getMissedAnswers() - 1);
            student.getMissedQuestions().remove(missedQuestion); // Remove from missed questions list
        }

        // Calculate the percentage score
        student.calculatePercentScore();
        // Save the updated student entity
        studentRepository.save(student);

        // Return the response indicating correctness and explanation
        return new AnswerResponse(isCorrect, question.getExplanation());
    }
}