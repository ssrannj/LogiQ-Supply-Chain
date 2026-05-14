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
    private final com.logiq.backend.service.WarrantyService warrantyService;

    @GetMapping("/orders/{id}/tracking/customer")
    public ResponseEntity<TrackingCustomerResponse> getCustomerTracking(@PathVariable String id) {
        String orderIdStr = id;

        com.logiq.backend.model.OrderPayment payment = orderPaymentRepository.findTopByOrderIdOrderByUploadTimeDesc(orderIdStr)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Order not found"));

        String currentStatus = payment.getStatus().name();
        
        List<TrackingCustomerResponse.Milestone> history = new ArrayList<>();
        if (payment != null) {
            history.add(TrackingCustomerResponse.Milestone.builder()
                    .status("ORDER_PLACED")
                    .timestamp(payment.getUploadTime())
                    .description("Order has been successfully placed and payment proof uploaded.")
                    .build());
            
            if (payment.getStatus() != com.logiq.backend.model.PaymentStatus.VERIFYING_ORDER) {
                String description = "Payment has been verified. Your order is now " + payment.getStatus().name().toLowerCase() + ".";
                
                // Add an explicit verification milestone for better demo UI
                if (payment.getStatus() == com.logiq.backend.model.PaymentStatus.PROCESSING) {
                    history.add(TrackingCustomerResponse.Milestone.builder()
                            .status("PAYMENT_VERIFIED")
                            .timestamp(LocalDateTime.now().minusMinutes(30)) // Simulate it happened a bit ago
                            .description("Our team has successfully verified your bank transfer proof.")
                            .build());
                }

                if (payment.getStatus() == com.logiq.backend.model.PaymentStatus.REJECTED) {
                    description = "Payment verification failed. Please check your email or contact support.";
                }
                
                history.add(TrackingCustomerResponse.Milestone.builder()
                        .status(payment.getStatus().name())
                        .timestamp(LocalDateTime.now()) // Approximate
                        .description(description)
                        .build());
            }
        }

        String warrantyStatus = "N/A";
        LocalDateTime warrantyExpiry = null;

        if (payment != null && payment.getProductId() != null) {
            try {
                com.logiq.backend.dto.WarrantyInfoResponse warrantyInfo = warrantyService.calculateWarranty(
                        payment.getProductId(), 
                        payment.getUploadTime().toLocalDate()
                );
                warrantyStatus = warrantyInfo.getActive() ? "ACTIVE" : "EXPIRED";
                if (warrantyInfo.getWarrantyExpiryDate() != null) {
                    warrantyExpiry = warrantyInfo.getWarrantyExpiryDate().atStartOfDay();
                }
            } catch (Exception e) {
                // Product might not have warranty or not found
            }
        }

        TrackingCustomerResponse response = TrackingCustomerResponse.builder()
                .orderId(id)
                .currentStatus(currentStatus)
                .milestoneHistory(history)
                .warrantyStatus(warrantyStatus)
                .warrantyExpiryDate(warrantyExpiry)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders/{id}/tracking")
    public ResponseEntity<TrackingAdminResponse> getAdminTracking(@PathVariable String id) {
        String orderIdStr = id;

        com.logiq.backend.model.OrderPayment payment = orderPaymentRepository.findTopByOrderIdOrderByUploadTimeDesc(orderIdStr)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Order tracking info not found"));

        String warrantyStatus = "N/A";
        if (payment.getProductId() != null) {
            try {
                com.logiq.backend.dto.WarrantyInfoResponse warrantyInfo = warrantyService.calculateWarranty(
                        payment.getProductId(), 
                        payment.getUploadTime().toLocalDate()
                );
                warrantyStatus = warrantyInfo.getActive() ? "ACTIVE" : "EXPIRED";
            } catch (Exception e) {
                // ignore
            }
        }

        TrackingAdminResponse response = TrackingAdminResponse.builder()
                .orderId(id)
                .status(payment.getStatus().name())
                .paymentVerificationState(payment.getStatus().name())
                .sourceWarehouse("Colombo Main Distribution Center")
                .adminNotes("Payment slip: " + payment.getFileName())
                .lastUpdated(LocalDateTime.now())
                .customerNotes("No specific notes.")
                .expectedDeliveryDate(payment.getUploadTime().plusDays(5))
                .warrantyStatus(warrantyStatus)
                .amount(payment.getAmount())
                .build();

        return ResponseEntity.ok(response);
    }
}
