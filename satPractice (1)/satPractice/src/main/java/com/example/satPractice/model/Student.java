package com.example.satPractice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@DiscriminatorValue("STUDENT")
public class Student extends User{

    private String firstName;
    private String lastName;

    private int targetScore;
    private int quizzesAttempted;
    private float percentScore;


}
