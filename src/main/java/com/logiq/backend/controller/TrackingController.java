package com.logiq.backend.controller;

import com.logiq.backend.dto.TrackingAdminResponse;
import com.logiq.backend.dto.TrackingCustomerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class TrackingController {
    
    private final com.logiq.backend.repository.OrderPaymentRepository orderPaymentRepository;

    @GetMapping("/orders/{id}/tracking/customer")
    public ResponseEntity<TrackingCustomerResponse> getCustomerTracking(@PathVariable String id) {
        // Mocked response for MVP foundation
        List<TrackingCustomerResponse.Milestone> history = new ArrayList<>();
        history.add(TrackingCustomerResponse.Milestone.builder()
                .status("ORDER_PLACED")
                .timestamp(LocalDateTime.now().minusDays(1))
                .description("Order has been successfully placed.")
                .build());
        history.add(TrackingCustomerResponse.Milestone.builder()
                .status("PAYMENT_VERIFYING")
                .timestamp(LocalDateTime.now().minusHours(5))
                .description("Waiting for payment slip verification.")
                .build());

        String currentStatus = "PAYMENT_NOT_RECEIVED";
        
        try {
            Long orderIdLong = Long.parseLong(id);
            currentStatus = orderPaymentRepository.findByOrderId(orderIdLong)
                    .map(payment -> payment.getStatus().name())
                    .orElse("PAYMENT_PENDING");
        } catch (NumberFormatException e) {
            // fallback if string id is used
        }

        TrackingCustomerResponse response = TrackingCustomerResponse.builder()
                .orderId(id)
                .currentStatus(currentStatus)
                .milestoneHistory(history)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders/{id}/tracking")
    public ResponseEntity<TrackingAdminResponse> getAdminTracking(@PathVariable String id) {
        // Mocked response for MVP foundation with admin-only details
        TrackingAdminResponse response = TrackingAdminResponse.builder()
                .orderId(id)
                .status("PAYMENT_VERIFYING")
                .paymentVerificationState("PENDING_SLIP_REVIEW")
                .sourceWarehouse("Colombo Main Distribution Center") // Placeholder
                .adminNotes("Customer uploaded a bank slip. Waiting for manual approval.") // Placeholder
                .lastUpdated(LocalDateTime.now())
                .customerNotes("Ship as soon as possible, fragile item.")
                .expectedDeliveryDate(LocalDateTime.now().plusDays(4))
                .warrantyStatus("ACTIVE")
                .build();

        return ResponseEntity.ok(response);
    }
}
