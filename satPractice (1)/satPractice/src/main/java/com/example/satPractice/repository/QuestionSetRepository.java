package com.example.satPractice.repository;

import com.example.satPractice.model.QuestionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet,Long> {
    long countByTitleStartingWith(String prefix);

    List<QuestionSet> findByMathQuestionIsNotEmpty();
    List<QuestionSet> findByTitle(String title);
    List<QuestionSet> findByEnglishQuestionsIsNotEmpty();

}
