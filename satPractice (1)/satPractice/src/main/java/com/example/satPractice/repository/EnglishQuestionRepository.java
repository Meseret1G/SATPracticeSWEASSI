package com.example.satPractice.repository;


import com.example.satPractice.model.EnglishQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnglishQuestionRepository extends JpaRepository<EnglishQuestion,Long> {
    List<EnglishQuestion> findByQuestionType(String questionType);

}
