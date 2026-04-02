package com.logiq.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PriorityScoreService {
    
    public int calculatePriorityScore(int daysUntilDeadline, boolean isUrgent, int orderAgeDays) {
        int score = 10 - daysUntilDeadline;
        
        if (isUrgent) {
            score += 20;
        }
        
        score += orderAgeDays;

        return Math.max(0, score);
    }
}
