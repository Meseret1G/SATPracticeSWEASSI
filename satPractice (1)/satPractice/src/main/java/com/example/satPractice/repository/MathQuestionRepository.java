package com.example.satPractice.repository;

import com.example.satPractice.model.MathQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface MathQuestionRepository extends JpaRepository<MathQuestion,Long> {
    List<MathQuestion> findByTopic(String topic);
//    boolean existsByText(String text);
//    Optional<MathQuestion> findByQuestionSetTitleAndId(String title, Long id);
    boolean existsByTextAndOptionAAndOptionBAndOptionCAndOptionD(String text, String optionA, String optionB, String optionC, String optionD);
    Optional<MathQuestion> findByTextAndOptionAAndOptionBAndOptionCAndOptionD(String text, String optionA, String optionB, String optionC, String optionD);

}
