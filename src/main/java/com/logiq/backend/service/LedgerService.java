package com.logiq.backend.service;

import com.logiq.backend.dto.RemittanceDTO;
import com.logiq.backend.model.Transaction;
import com.logiq.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LedgerService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<RemittanceDTO> getDailyRemittance(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<Transaction> transactions = transactionRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        Map<Long, List<Transaction>> groupedByDriver = transactions.stream()
                .collect(Collectors.groupingBy(t -> t.getDriver().getId()));

        return groupedByDriver.entrySet().stream()
                .map(entry -> {
                    Long driverId = entry.getKey();
                    List<Transaction> driverTransactions = entry.getValue();
                    String driverName = driverTransactions.get(0).getDriver().getFullName();
                    double totalAmount = driverTransactions.stream().mapToDouble(Transaction::getAmount).sum();
                    long count = driverTransactions.size();
                    return new RemittanceDTO(driverId, driverName, totalAmount, count);
                })
                .collect(Collectors.toList());
    }
}
