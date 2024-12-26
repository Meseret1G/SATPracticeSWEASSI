package com.example.satPractice.controller;

import com.example.satPractice.dto.AnswerRequest;
import com.example.satPractice.model.BaseQuestion;
import com.example.satPractice.model.EnglishQuestion;
import com.example.satPractice.model.MathQuestion;
import com.example.satPractice.model.QuestionSet;
import com.example.satPractice.repository.QuestionSetRepository;
import com.example.satPractice.service.QuestionAnsweringService;
import com.example.satPractice.service.QuestionSetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/question")
public class QuestionSetController {

    private final QuestionSetService questionSetService;
    @Autowired
    private QuestionSetRepository questionSetRepository;

    public QuestionSetController(QuestionSetService questionSetService){
        this.questionSetService=questionSetService;
    }
    @Autowired
    private QuestionAnsweringService questionAnsweringService;
    @PostMapping("/add")
    public ResponseEntity<?> addQuestionSet(@RequestBody QuestionSet questionSet, @RequestParam String questionType) {

        if (questionType.equals("Math")) {
            if (questionSet.getMathQuestion() == null || questionSet.getMathQuestion().size() != 5) {
                return new ResponseEntity<>("You must add exactly 5 Math questions.", HttpStatus.BAD_REQUEST);
            }
            Set<String> questionTextSet = new HashSet<>();
            for (MathQuestion mathQuestion : questionSet.getMathQuestion()) {
                if (!questionTextSet.add(mathQuestion.getText())) {
                    return new ResponseEntity<>("Duplicate question found in Math questions.", HttpStatus.BAD_REQUEST);
                }
            }
        } else if (questionType.equals("English")) {
            if (questionSet.getEnglishQuestions() == null || questionSet.getEnglishQuestions().size() != 5) {
                return new ResponseEntity<>("You must add exactly 5 English questions.", HttpStatus.BAD_REQUEST);
            }
            Set<String> questionTextSet = new HashSet<>();
            for (EnglishQuestion englishQuestion : questionSet.getEnglishQuestions()) {
                if (!questionTextSet.add(englishQuestion.getText())) {
                    return new ResponseEntity<>("Duplicate question found in English questions.", HttpStatus.BAD_REQUEST);
                }
            }
        }

        try {
            QuestionSet savedQuestionSet = questionSetService.addQuestionSet(questionSet, questionType);
            return new ResponseEntity<>(savedQuestionSet, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/byType")
    public ResponseEntity<List<QuestionSet>> getQuestionSetsByType(@RequestParam String type) {
        try {
            List<QuestionSet> questionSets = questionSetService.findQuestionSetsByType(type);
            return ResponseEntity.ok(questionSets);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/title")
    public ResponseEntity<List<QuestionSet>> getQuestionsByTitle(@RequestParam String title) {
        List<QuestionSet> questions = questionSetService.findByTitle(title);
        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/start/{studentId}/{questionSetId}")
    public QuestionSet startPractice(@PathVariable Long studentId, @PathVariable Long questionSetId) {
        return questionSetService.startPracticeSession(studentId, questionSetId);
    }

    @PostMapping("/answer")
    public ResponseEntity<QuestionAnsweringService.AnswerResponse> answerQuestion(
            @RequestBody AnswerRequest request) {
        QuestionAnsweringService.AnswerResponse response = questionAnsweringService.answerQuestion(
                request.getStudentId(),
                request.getQuestionId(),
                request.getQuestionSetTitle(),
                request.getSelectedAnswer());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentId}/completed-question-sets")
    public List<QuestionSet> getCompletedQuestionSets(@PathVariable Long studentId) {
        return questionAnsweringService.getCompletedQuestionSets(studentId);
    }

    @PostMapping("/{studentId}/completed-question-sets/{questionSetId}")
    public void markQuestionSetAsCompleted(@PathVariable Long studentId, @PathVariable Long questionSetId) {
        questionAnsweringService.markQuestionSetAsCompleted(studentId, questionSetId);
    }
}
