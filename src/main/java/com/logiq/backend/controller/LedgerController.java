package com.logiq.backend.controller;

import com.logiq.backend.dto.RemittanceDTO;
import com.logiq.backend.service.LedgerService;
import com.logiq.backend.service.BonusCalculationService;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@CrossOrigin(origins = "*")
public class LedgerController {

    @Autowired
    private LedgerService ledgerService;

    @Autowired
    private BonusCalculationService bonusCalculationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/daily-remittance")
    public List<RemittanceDTO> getDailyRemittance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return ledgerService.getDailyRemittance(date);
    }

    @GetMapping("/drivers")
    public List<com.logiq.backend.model.User> getDrivers() {
        return userRepository.findByRole(com.logiq.backend.model.UserRole.DRIVER);
    }

    @GetMapping("/bonus/{id}")
    public com.logiq.backend.dto.DriverBonusDTO getBonus(@PathVariable Long id) {
        return bonusCalculationService.calculateBonus(id);
    }

    @PostMapping("/payment")
    public String submitPayment(@RequestBody com.logiq.backend.dto.PaymentRequestDTO request) {
        com.logiq.backend.model.User driver = userRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        com.logiq.backend.model.Transaction payment = new com.logiq.backend.model.Transaction(
                driver, 
                request.getAmount(), 
                com.logiq.backend.model.TransactionType.BONUS_PAYMENT, 
                "Bonus Payout", 
                request.getSignatureBase64()
        );
        
        transactionRepository.save(payment);
        return "Payment of $" + request.getAmount() + " processed for " + driver.getFullName();
    }

    @PostMapping("/seed")
    public String seedData() {
        // Simple seed logic
        com.logiq.backend.model.User driver = userRepository.findByRole(com.logiq.backend.model.UserRole.DRIVER).stream().findFirst().orElse(null);
        if (driver == null) return "No drivers found to seed transactions for.";
        
        transactionRepository.save(new com.logiq.backend.model.Transaction(driver, 100.0, com.logiq.backend.model.TransactionType.DELIVERY, "Demo Delivery 1", null));
        transactionRepository.save(new com.logiq.backend.model.Transaction(driver, 100.0, com.logiq.backend.model.TransactionType.DELIVERY, "Demo Delivery 2", null));
        transactionRepository.save(new com.logiq.backend.model.Transaction(driver, 50.0, com.logiq.backend.model.TransactionType.PENALTY, "Speeding Penalty", null));
        
        return "Demo data seeded for " + driver.getFullName();
    }
}
