package com.example.satPractice.repository;

import com.example.satPractice.model.MathQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MathQuestionRepository extends JpaRepository<MathQuestion,Long> {
    List<MathQuestion> findByTopic(String topic);

}
