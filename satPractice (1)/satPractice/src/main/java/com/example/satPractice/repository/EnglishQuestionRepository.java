package com.example.satPractice.repository;


import com.example.satPractice.model.EnglishQuestion;
import com.example.satPractice.model.MathQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnglishQuestionRepository extends JpaRepository<EnglishQuestion,Long> {
    List<EnglishQuestion> findByQuestionType(String questionType);
//    Optional<EnglishQuestion> findByQuestionSetTitleAndId(String title, Long id);
//    boolean existsByText(String text);
    boolean existsByTextAndOptionAAndOptionBAndOptionCAndOptionD(String text, String optionA, String optionB, String optionC, String optionD);
    Optional<EnglishQuestion> findByTextAndOptionAAndOptionBAndOptionCAndOptionD(String text, String optionA, String optionB, String optionC, String optionD);

}
