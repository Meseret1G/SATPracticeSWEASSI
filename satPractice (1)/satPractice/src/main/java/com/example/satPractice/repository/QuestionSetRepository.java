package com.example.satPractice.repository;

import com.example.satPractice.model.QuestionSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet,Long> {
    long countByTitleStartingWith(String prefix);

    Page<QuestionSet> findByMathQuestionIsNotEmpty(Pageable pageable);
    List<QuestionSet> findByTitle(String title);
    Page<QuestionSet> findByEnglishQuestionsIsNotEmpty(Pageable pageable);


}
