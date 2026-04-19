package com.logiq.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "damage_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DamageTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;
    
    private Long productId;

    private Long userId; // The person reporting it

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private String status; // e.g., QUARANTINED, INVESTIGATING, RESOLVED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "QUARANTINED";
        }
    }
}
