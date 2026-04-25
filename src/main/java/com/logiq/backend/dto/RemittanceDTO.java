package com.logiq.backend.dto;

public class RemittanceDTO {
    private Long driverId;
    private String driverName;
    private Double totalAmount;
    private Long transactionCount;

    public RemittanceDTO() {}

    public RemittanceDTO(Long driverId, String driverName, Double totalAmount, Long transactionCount) {
        this.driverId = driverId;
        this.driverName = driverName;
        this.totalAmount = totalAmount;
        this.transactionCount = transactionCount;
    }

    // Getters and Setters
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Long transactionCount) { this.transactionCount = transactionCount; }
}
