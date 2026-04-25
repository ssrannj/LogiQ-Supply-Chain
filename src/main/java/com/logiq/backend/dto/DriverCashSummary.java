package com.logiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DriverCashSummary {
    private String driverName;
    private BigDecimal totalCash;
}
