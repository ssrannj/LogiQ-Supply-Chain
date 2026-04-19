package com.logiq.backend.repository;

import com.logiq.backend.model.DamageTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DamageTicketRepository extends JpaRepository<DamageTicket, Long> {
    List<DamageTicket> findByOrderId(String orderId);
    List<DamageTicket> findByUserId(Long userId);
}
