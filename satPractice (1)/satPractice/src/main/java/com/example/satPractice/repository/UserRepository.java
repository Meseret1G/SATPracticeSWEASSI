package com.example.satPractice.repository;

import com.example.satPractice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByPasswordResetToken(String passwordResetToken);
    @Modifying
    @Query("DELETE FROM User u WHERE u.enabled = false")
    void deleteExpiredUnverifiedAccounts(LocalDateTime currentTime);
}
