package com.logiq.backend.repository;

import com.logiq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // This is a magic Spring Boot method.
    // Just by naming it "findByEmail", Spring Boot automatically writes the SQL query for us!
    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(com.logiq.backend.model.UserRole role);

}