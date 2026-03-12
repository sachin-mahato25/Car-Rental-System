package com.carrental.repository;

import com.carrental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_CustomerId(Long customerId);
    List<Booking> findByCar_CarId(Long carId);
    List<Booking> findByStatus(Booking.Status status);
}
