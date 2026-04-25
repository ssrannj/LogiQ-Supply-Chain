package com.logiq.backend.controller;

import com.logiq.backend.dto.DriverCashSummary;
import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.repository.OrderPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accountant")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AccountantController {

    private final OrderPaymentRepository orderPaymentRepository;

    @GetMapping("/transactions")
    public ResponseEntity<List<OrderPayment>> getAllTransactions() {
        return ResponseEntity.ok(orderPaymentRepository.findAll());
    }

    @GetMapping("/driver-summary")
    public ResponseEntity<List<DriverCashSummary>> getDriverSummary() {
        List<OrderPayment> payments = orderPaymentRepository.findAll();
        
        Map<String, BigDecimal> summaryMap = payments.stream()
                .filter(p -> p.getDriverName() != null)
                .collect(Collectors.groupingBy(
                        OrderPayment::getDriverName,
                        Collectors.reducing(BigDecimal.ZERO, OrderPayment::getAmount, BigDecimal::add)
                ));

        List<DriverCashSummary> response = summaryMap.entrySet().stream()
                .map(entry -> new DriverCashSummary(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
