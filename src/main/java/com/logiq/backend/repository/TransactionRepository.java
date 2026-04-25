package com.logiq.backend.repository;

import com.logiq.backend.model.Transaction;
import com.logiq.backend.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDriverId(Long driverId);
    List<Transaction> findByDriverIdAndType(Long driverId, TransactionType type);
    List<Transaction> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
