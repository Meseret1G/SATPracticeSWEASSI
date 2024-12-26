package com.example.satPractice.controller;

import com.example.satPractice.dto.EnglishQuestionDTO;
import com.example.satPractice.model.EnglishQuestion;
import com.example.satPractice.service.EnglishQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/question/english-questions")
public class EnglishQuestionController {
    @Autowired
    private EnglishQuestionService englishQuestionService;

    @GetMapping("/type/{questionType}")
    public List<EnglishQuestionDTO> getEnglishQuestionsByType(@PathVariable String questionType) {
        return englishQuestionService.getEnglishQuestionsByType(questionType);
    }


    @PutMapping("/{id}")
    public ResponseEntity<EnglishQuestion> editEnglishQuestion(
            @PathVariable Long id,
            @RequestBody EnglishQuestion updatedQuestion) {
        EnglishQuestion editedQuestion = englishQuestionService.editEnglishQuestion(id, updatedQuestion);
        return ResponseEntity.ok(editedQuestion);
    }
}
