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
            boolean alreadyMissed = student.getMissedQuestions().stream()
                    .anyMatch(mq -> mq.getQuestionId().equals(questionId) && mq.getQuestionSetTitle().equals(questionSetTitle));

            if (!alreadyMissed) {
                student.getMissedQuestions().add(new MissedQuestion(questionId, questionSetTitle));
                student.setMissedAnswers(student.getMissedAnswers() + 1);
            }   }

        if (student.getTargetScore() > 0) {
            student.setPercentScore(Float.parseFloat(String.format("%.2f", (float) student.getAnsweredQuestions() / student.getTargetScore() * 100)));        } else {
            student.setPercentScore(0);
        }

        boolean isQuestionSetCompleted = student.getCompletedQuestionSets().contains(questionSet);

        student.setQuizzesAttempted((int) countCompletedQuestionSets(studentId));
        if (!isQuestionSetCompleted) {
            studentRepository.save(student);
        }


        return new AnswerResponse(isCorrect, question.getExplanation());
    }

//for future

    public AnswerResponse reattemptMissedQuestion(Long studentId, Long questionId, String questionSetTitle, String selectedAnswer) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        MissedQuestion missedQuestion = student.getMissedQuestions().stream()
                .filter(mq -> mq.getQuestionId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Question not found in missed questions"));

        List<QuestionSet> questionSets = questionSetRepository.findByTitle(questionSetTitle);
        if (questionSets.isEmpty()) {
            throw new IllegalArgumentException("Question Set not found");
        } else if (questionSets.size() > 1) {
            throw new IllegalArgumentException("Multiple Question Sets found with the same title");
        }

        QuestionSet questionSet = questionSets.get(0);

        BaseQuestion question = null;
        MathQuestion mathQuestion = questionSet.getMathQuestion().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElse(null);

        EnglishQuestion englishQuestion = questionSet.getEnglishQuestions().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElse(null);

        if (mathQuestion != null) {
            question = mathQuestion;
        } else if (englishQuestion != null) {
            question = englishQuestion;
        } else {
            throw new IllegalArgumentException("Question not found in the Question Set");
        }

        System.out.println("Reattempting Question: " + question.getText() + ", Type: " + question.getClass().getSimpleName());
        System.out.println("Correct Answer: '" + question.getCorrectAnswer() + "'");
        System.out.println("Selected Answer: '" + selectedAnswer + "'");

        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

        if (isCorrect) {
            student.setAnsweredQuestions(student.getAnsweredQuestions() + 1);
            student.setMissedAnswers(student.getMissedAnswers() - 1);
            student.getMissedQuestions().remove(missedQuestion);
        }

        if (student.getTargetScore() > 0) {
            student.setPercentScore(Float.parseFloat(String.format("%.2f", (float) student.getAnsweredQuestions() / student.getTargetScore() * 100)));        } else {
            student.setPercentScore(0);
        }
        studentRepository.save(student);

        return new AnswerResponse(isCorrect, question.getExplanation());
    }


    public long countMissedQuestions(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return student.getMissedQuestions().size();
    }
    public List<MissedQuestion> getMissedQuestions(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return student.getMissedQuestions();
    }
    public long countCompletedQuestionSets(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return student.getCompletedQuestionSets().size();
    }
    public Object getQuestionBySetAndId(String questionSetTitle, Long questionId) {
        List<QuestionSet> questionSets = questionSetRepository.findByTitle(questionSetTitle);

        if (questionSets.isEmpty()) {
            throw new IllegalArgumentException("No QuestionSets found with title: " + questionSetTitle);
        }

        QuestionSet questionSet = questionSets.get(0);

        for (MathQuestion mathQuestion : questionSet.getMathQuestion()) {
            if (mathQuestion.getId().equals(questionId)) {
                return mathQuestion;
            }
        }

        for (EnglishQuestion englishQuestion : questionSet.getEnglishQuestions()) {
            if (englishQuestion.getId().equals(questionId)) {
                return englishQuestion;
            }
        }

        throw new IllegalArgumentException("Question not found with ID: " + questionId);
    }


}