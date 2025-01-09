package com.example.satPractice.service;

import com.example.satPractice.dto.EnglishQuestionDTO;
import com.example.satPractice.model.EnglishQuestion;
import com.example.satPractice.model.MathQuestion;
import com.example.satPractice.model.QuestionSet;
import com.example.satPractice.repository.EnglishQuestionRepository;
import com.example.satPractice.repository.QuestionSetRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnglishQuestionService {
    @Autowired
    private EnglishQuestionRepository englishQuestionRepository;

//    @Autowired
//    private QuestionSetRepository questionSetRepository;

    public List<EnglishQuestionDTO> getEnglishQuestionsByType(String questionType) {
        List<EnglishQuestion> questions = englishQuestionRepository.findByQuestionType(questionType);
        if (questions.isEmpty()) {
            throw new EntityNotFoundException("No questions found for type: " + questionType);
        }
        return questions.stream().map(question -> {
            EnglishQuestionDTO dto = new EnglishQuestionDTO();
            dto.setId(question.getId());
            dto.setText(question.getText());
            dto.setOptionA(question.getOptionA());
            dto.setOptionB(question.getOptionB());
            dto.setOptionC(question.getOptionC());
            dto.setOptionD(question.getOptionD());
            dto.setCorrectAnswer(question.getCorrectAnswer());
            dto.setExplanation(question.getExplanation());
            dto.setDifficulty(question.getDifficulty());
            dto.setQuestionType(question.getQuestionType());
            dto.setQuestionSetName(question.getQuestionSet() != null ? question.getQuestionSet().getTitle() : null);
            return dto;
        }).toList();
    }

    public EnglishQuestion editEnglishQuestion(Long id, EnglishQuestion updatedEnglishQuestion){
        Optional<EnglishQuestion> existingQuestion = englishQuestionRepository.findById(id);
        if(!existingQuestion.isPresent()){
            throw new IllegalArgumentException("English Question with the given ID not found");
        }

        EnglishQuestion englishQuestion=existingQuestion.get();
        if (updatedEnglishQuestion.getId() != null && !updatedEnglishQuestion.getId().equals(id)) {
            throw new IllegalArgumentException("Mismatched IDs: Updated question ID must match the existing question ID.");
        }
        boolean duplicateExists = englishQuestionRepository.existsByTextAndOptionAAndOptionBAndOptionCAndOptionD(
                updatedEnglishQuestion.getText(),
                updatedEnglishQuestion.getOptionA(),
                updatedEnglishQuestion.getOptionB(),
                updatedEnglishQuestion.getOptionC(),
                updatedEnglishQuestion.getOptionD()
        );
        if (duplicateExists) {
            Optional<EnglishQuestion> duplicateQuestion = englishQuestionRepository
                    .findByTextAndOptionAAndOptionBAndOptionCAndOptionD(updatedEnglishQuestion.getText(),
                            updatedEnglishQuestion.getOptionA(), updatedEnglishQuestion.getOptionB(),
                            updatedEnglishQuestion.getOptionC(), updatedEnglishQuestion.getOptionD());

            if (duplicateQuestion.isPresent() && !duplicateQuestion.get().getId().equals(id)) {
                throw new IllegalArgumentException("Duplicate question found: A question with the same text and options already exists.");
            }
        }
        QuestionSet existingQuestionSet = englishQuestion.getQuestionSet();

        englishQuestion.setText(updatedEnglishQuestion.getText());
        englishQuestion.setOptionA(updatedEnglishQuestion.getOptionA());
        englishQuestion.setOptionB(updatedEnglishQuestion.getOptionB());
        englishQuestion.setOptionC(updatedEnglishQuestion.getOptionC());
        englishQuestion.setOptionD(updatedEnglishQuestion.getOptionD());
        englishQuestion.setCorrectAnswer(updatedEnglishQuestion.getCorrectAnswer());
        englishQuestion.setDifficulty(updatedEnglishQuestion.getDifficulty());
        englishQuestion.setExplanation(updatedEnglishQuestion.getExplanation());
        englishQuestion.setQuestionType(updatedEnglishQuestion.getQuestionType());
        englishQuestion.setQuestionSet(existingQuestionSet);

        return englishQuestionRepository.save(englishQuestion);
    }




}
