package com.example.satPractice.dto;

import com.example.satPractice.model.Student;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class StudentInfo {
    private String firstName;
    private String lastName;
    private String username;
    private double percentScore;
    private int targetScore;

    public StudentInfo(Student student) {
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
        this.username = student.getUsername();
        this.percentScore = student.getPercentScore();
        this.targetScore = student.getTargetScore();
    }
}
