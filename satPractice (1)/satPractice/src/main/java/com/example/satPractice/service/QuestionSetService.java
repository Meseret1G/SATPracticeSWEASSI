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
public class QuestionSetService {

    private final QuestionSetRepository questionSetRepository;
    @Autowired
    private MathQuestionRepository mathQuestionRepository;
    @Autowired
    private EnglishQuestionRepository englishQuestionRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    public QuestionSetService(QuestionSetRepository questionSetRepository){
        this.questionSetRepository=questionSetRepository;
    }

    public QuestionSet addQuestionSet(QuestionSet questionSet, String questionType) {
        if (questionType.equals("MATH") && questionSet.getMathQuestion().size() == 5) {

            for (MathQuestion mathQuestion : questionSet.getMathQuestion()) {
                if (mathQuestionExists(mathQuestion)){
                    throw new IllegalArgumentException("The question '"+ mathQuestion.getText()+" 'already exists.");
                }
                mathQuestion.setQuestionSet(questionSet);
            }
            questionSet.setTitle(generateSetTitle("Math"));
            return questionSetRepository.save(questionSet);
        } else if (questionType.equals("ENGLISH") && questionSet.getEnglishQuestions().size() == 5) {
            for (EnglishQuestion englishQuestion : questionSet.getEnglishQuestions()) {
                if (englishQuestionExists(englishQuestion)) {
                    throw new IllegalArgumentException("The question '" + englishQuestion.getText() + "' already exists.");
                }
                englishQuestion.setQuestionSet(questionSet);
            }
            questionSet.setTitle(generateSetTitle("English"));
            return questionSetRepository.save(questionSet);
        } else {
            throw new IllegalArgumentException("You must add exactly 5 questions of the selected type.");
        }
    }
    private boolean mathQuestionExists(MathQuestion mathQuestion) {
        return mathQuestionRepository.existsByText(mathQuestion.getText());
    }
    private boolean englishQuestionExists(EnglishQuestion englishQuestion) {
        return englishQuestionRepository.existsByText(englishQuestion.getText());
    }
    private String generateSetTitle(String type) {
        long count = questionSetRepository.countByTitleStartingWith(type);
        return type + " Set " + (count + 1);
    }

    public List<QuestionSet> findQuestionSetsByType(String type) {
        if (type == null || (!type.equalsIgnoreCase("Math") && !type.equalsIgnoreCase("English"))) {
            throw new IllegalArgumentException("Invalid type. Please specify 'Math' or 'English'.");
        }

        if (type.equalsIgnoreCase("Math")) {
            return questionSetRepository.findByMathQuestionIsNotEmpty();
        } else {
            return questionSetRepository.findByEnglishQuestionsIsNotEmpty();
        }
    }

    public List<QuestionSet> getQuestionSetsByTitle(String title) {
        return questionSetRepository.findByTitle(title);
    }

    public QuestionSet startPracticeSession(Long studentId, Long questionSetId) {
        QuestionSet questionSet = questionSetRepository.findById(questionSetId)
                .orElseThrow(() -> new IllegalArgumentException("Question set not found"));

        Student student = studentRepository.findById(studentId).orElseThrow();
        student.setAnsweredQuestions(0);
        student.setMissedAnswers(0);
        student.setQuizzesAttempted(0);
        student.setPercentScore(0);
        student.getMissedQuestions().clear();

        studentRepository.save(student);

        return questionSet;
    }

    public List<MissedQuestion> getMissedQuestions(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return student.getMissedQuestions();
    }
    public long countMissedQuestions(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        return student.getMissedQuestions().size();
    }
    public Optional<MathQuestion> findMathQuestionByTitleAndId(String title, Long id) {
        return mathQuestionRepository.findByQuestionSetTitleAndId(title, id);
    }

    public Optional<EnglishQuestion> findEnglishQuestionByTitleAndId(String title, Long id) {
        return englishQuestionRepository.findByQuestionSetTitleAndId(title, id);
    }
    public List<QuestionSet> findByTitle(String title) {
        return questionSetRepository.findByTitle(title);
    }
}
