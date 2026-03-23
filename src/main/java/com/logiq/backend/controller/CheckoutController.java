package com.logiq.backend.controller;

import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.repository.OrderPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

import com.logiq.backend.model.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/orders/checkout")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CheckoutController {

    private final OrderPaymentRepository orderPaymentRepository;

    @Value("${upload.path:./uploads/receipts}")
    private String uploadPath;

    @PostMapping("/bank-transfer")
    public ResponseEntity<?> uploadBankTransferProof(
            @RequestParam("orderId") String orderId,
            @RequestParam("productId") Long productId,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
        }

        // Simple validation for PDF or Images
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only images and PDF files are allowed"));
        }

        try {
            // Ensure directory exists
            Path root = Paths.get(uploadPath).toAbsolutePath().normalize();
            if (!Files.exists(root)) {
                Files.createDirectories(root);
                log.info("Created upload directory: " + root);
            }

            // Generate unique filename with original extension
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            
            Path targetPath = root.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Uploaded file for order ID {}: {}", orderId, uniqueFileName);

            // Record in Database
            OrderPayment payment = OrderPayment.builder()
                    .orderId(orderId)
                    .productId(productId)
                    .amount(amount)
                    .fileName(uniqueFileName)
                    .fileType(contentType)
                    .storagePath(targetPath.toString())
                    .status(PaymentStatus.VERIFYING_ORDER)
                    .uploadTime(LocalDateTime.now())
                    .build();

            orderPaymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                "message", "Successfully uploaded and waiting for verification",
                "referenceId", payment.getId(),
                "orderId", orderId,
                "status", payment.getStatus()
            ));

        } catch (IOException e) {
            log.error("Failed to upload file for order ID {}: {}", orderId, e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}
