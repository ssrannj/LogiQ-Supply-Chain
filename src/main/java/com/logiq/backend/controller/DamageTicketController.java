package com.logiq.backend.controller;

import com.logiq.backend.model.DamageTicket;
import com.logiq.backend.service.DamageTicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/damage-tickets")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DamageTicketController {

    private final DamageTicketService damageTicketService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<DamageTicket> createTicket(
            @RequestParam("orderId") String orderId,
            @RequestParam("productId") Long productId,
            @RequestParam("userId") Long userId,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            DamageTicket ticket = damageTicketService.createTicket(orderId, productId, userId, description, image);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            log.error("Failed to create damage ticket: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
