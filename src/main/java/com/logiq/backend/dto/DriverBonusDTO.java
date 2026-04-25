package com.logiq.backend.dto;

public class DriverBonusDTO {
    private Long driverId;
    private String driverName;
    private Long deliveryCount;
    private Double averageRating;
    private Double totalPenalties;
    private Double baseRate;
    private Double finalBonus;

    public DriverBonusDTO() {}

    // Getters and Setters
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public Long getDeliveryCount() { return deliveryCount; }
    public void setDeliveryCount(Long deliveryCount) { this.deliveryCount = deliveryCount; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Double getTotalPenalties() { return totalPenalties; }
    public void setTotalPenalties(Double totalPenalties) { this.totalPenalties = totalPenalties; }

    public Double getBaseRate() { return baseRate; }
    public void setBaseRate(Double baseRate) { this.baseRate = baseRate; }

    public Double getFinalBonus() { return finalBonus; }
    public void setFinalBonus(Double finalBonus) { this.finalBonus = finalBonus; }
}
