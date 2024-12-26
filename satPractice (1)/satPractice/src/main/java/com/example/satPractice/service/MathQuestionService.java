package com.example.satPractice.service;

import com.example.satPractice.dto.EnglishQuestionDTO;
import com.example.satPractice.dto.MathQuestionDTO;
import com.example.satPractice.model.EnglishQuestion;
import com.example.satPractice.model.MathQuestion;
import com.example.satPractice.model.QuestionSet;
import com.example.satPractice.repository.MathQuestionRepository;
import com.example.satPractice.repository.QuestionSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MathQuestionService {
    @Autowired
    private MathQuestionRepository mathQuestionRepository;

    @Autowired
    private QuestionSetRepository questionSetRepository;

    public List<MathQuestionDTO> getMathQuestionsByType(String questionType) {
        List<MathQuestion> questions = mathQuestionRepository.findByTopic(questionType);

        return questions.stream().map(question -> {
            MathQuestionDTO dto = new MathQuestionDTO();
            dto.setId(question.getId());
            dto.setText(question.getText());
            dto.setOptionA(question.getOptionA());
            dto.setOptionB(question.getOptionB());
            dto.setOptionC(question.getOptionC());
            dto.setOptionD(question.getOptionD());
            dto.setCorrectAnswer(question.getCorrectAnswer());
            dto.setExplanation(question.getExplanation());
            dto.setDifficulty(question.getDifficulty());
            dto.setTopic(question.getTopic());
            dto.setQuestionSetName(question.getQuestionSet() != null ? question.getQuestionSet().getTitle() : null);
            return dto;
        }).toList();
    }


    public MathQuestion editMathQuestion(Long id,MathQuestion updatedMathQuestion){
        Optional<MathQuestion> existingQuestion= mathQuestionRepository.findById(id);
        if(!existingQuestion.isPresent()){
            throw new IllegalArgumentException("Math question with the given ID not found.");
        }

        MathQuestion mathQuestion=existingQuestion.get();
        if (updatedMathQuestion.getId() != null && !updatedMathQuestion.getId().equals(id)) {
            throw new IllegalArgumentException("Mismatched IDs: Updated question ID must match the existing question ID.");
        }
        QuestionSet existingQuestionSet = mathQuestion.getQuestionSet();

        mathQuestion.setText(updatedMathQuestion.getText());
        mathQuestion.setOptionA(updatedMathQuestion.getOptionA());
        mathQuestion.setOptionB(updatedMathQuestion.getOptionB());
        mathQuestion.setOptionC(updatedMathQuestion.getOptionC());
        mathQuestion.setOptionD(updatedMathQuestion.getOptionD());
        mathQuestion.setCorrectAnswer(updatedMathQuestion.getCorrectAnswer());
        mathQuestion.setDifficulty(updatedMathQuestion.getDifficulty());
        mathQuestion.setTopic(updatedMathQuestion.getTopic());
        mathQuestion.setExplanation(updatedMathQuestion.getExplanation());
        mathQuestion.setQuestionSet(existingQuestionSet);

        return mathQuestionRepository.save(mathQuestion);
    }


    }
