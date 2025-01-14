package com.example.satPractice.controller;

import com.example.satPractice.dto.MathQuestionDTO;
import com.example.satPractice.model.MathQuestion;
import com.example.satPractice.service.MathQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/question/math-questions")
public class MathQuestionController {
    @Autowired
    private MathQuestionService mathQuestionService;

    @GetMapping("/topic/{topic}")
    public List<MathQuestionDTO> getMathQuestionsByType(@PathVariable String topic) {
        return mathQuestionService.getMathQuestionsByType(topic);
    }



    @PutMapping("/{id}")
    public ResponseEntity<MathQuestion> editMathQuestion(
            @PathVariable Long id,
            @RequestBody MathQuestion updatedQuestion) {
        MathQuestion editedQuestion = mathQuestionService.editMathQuestion(id, updatedQuestion);
        return ResponseEntity.ok(editedQuestion);
    }


}
