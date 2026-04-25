package com.logiq.backend.service;

import com.logiq.backend.dto.DriverBonusDTO;
import com.logiq.backend.model.DriverReview;
import com.logiq.backend.model.Transaction;
import com.logiq.backend.model.TransactionType;
import com.logiq.backend.model.User;
import com.logiq.backend.repository.DriverReviewRepository;
import com.logiq.backend.repository.TransactionRepository;
import com.logiq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BonusCalculationService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private DriverReviewRepository driverReviewRepository;

    @Autowired
    private UserRepository userRepository;

    private static final double DEFAULT_BASE_RATE = 50.0;

    public DriverBonusDTO calculateBonus(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<Transaction> deliveries = transactionRepository.findByDriverIdAndType(driverId, TransactionType.DELIVERY);
        List<Transaction> penaltiesList = transactionRepository.findByDriverIdAndType(driverId, TransactionType.PENALTY);
        List<DriverReview> reviews = driverReviewRepository.findByDriverId(driverId);

        long deliveryCount = deliveries.size();
        double totalPenalties = penaltiesList.stream().mapToDouble(Transaction::getAmount).sum();
        
        double averageRating = reviews.stream()
                .mapToInt(DriverReview::getRating)
                .average()
                .orElse(5.0); // Assume 5.0 if no reviews yet

        double baseRate = DEFAULT_BASE_RATE;
        
        // Bonus = (deliveries * baseRate) * (averageRating / 5.0) - penalties
        double rawBonus = (deliveryCount * baseRate) * (averageRating / 5.0);
        double finalBonus = Math.max(0, rawBonus - totalPenalties);

        DriverBonusDTO dto = new DriverBonusDTO();
        dto.setDriverId(driverId);
        dto.setDriverName(driver.getFullName());
        dto.setDeliveryCount(deliveryCount);
        dto.setAverageRating(averageRating);
        dto.setTotalPenalties(totalPenalties);
        dto.setBaseRate(baseRate);
        dto.setFinalBonus(finalBonus);

        return dto;
    }
}
