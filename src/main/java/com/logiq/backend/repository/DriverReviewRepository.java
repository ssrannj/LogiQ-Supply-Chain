package com.logiq.backend.repository;

import com.logiq.backend.model.DriverReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverReviewRepository extends JpaRepository<DriverReview, Long> {
    List<DriverReview> findByDriverId(Long driverId);
}
