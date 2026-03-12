package com.carrental.controller;

import com.carrental.dto.BookingDto;
import com.carrental.dto.BookingRequest;
import com.carrental.model.Booking;
import com.carrental.model.Car;
import com.carrental.model.Customer;
import com.carrental.model.User;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import com.carrental.repository.UserRepository;
import com.carrental.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingRepository  bookingRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private CarRepository      carRepository;
    @Autowired private UserRepository     userRepository;
    @Autowired private JwtUtils           jwtUtils;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyBookings(@RequestHeader("Authorization") String authHeader) {
        String username = jwtUtils.getUsernameFromToken(authHeader.substring(7));
        User user = userRepository.findByUsername(username).orElseThrow();
        Customer customer = customerRepository.findByUser_UserId(user.getUserId()).orElseThrow();
        List<BookingDto> list = bookingRepository.findByCustomer_CustomerId(customer.getCustomerId())
            .stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest req,
                                           @RequestHeader("Authorization") String authHeader) {
        String username = jwtUtils.getUsernameFromToken(authHeader.substring(7));
        User user = userRepository.findByUsername(username).orElseThrow();
        Customer customer = customerRepository.findByUser_UserId(user.getUserId()).orElseThrow();

        Car car = carRepository.findById(req.getCarId()).orElse(null);
        if (car == null) return ResponseEntity.badRequest().body("Car not found");
        if (car.getStatus() != Car.Status.AVAILABLE)
            return ResponseEntity.badRequest().body("Car is not available.");

        long days = ChronoUnit.DAYS.between(req.getPickupDate(), req.getReturnDate());
        if (days < 0) return ResponseEntity.badRequest().body("Return date cannot be before pickup date.");

        // Same day booking counts as 1 day minimum
        long billingDays = Math.max(1, days);
        BigDecimal total = car.getPricePerDay().multiply(BigDecimal.valueOf(billingDays));

        Booking booking = Booking.builder()
            .customer(customer).car(car)
            .pickupDate(req.getPickupDate()).returnDate(req.getReturnDate())
            .pickupTime(req.getPickupTime()).returnTime(req.getReturnTime())
            .destination(req.getDestination()).phone(req.getPhone())
            .paymentMethod(req.getPaymentMethod()).bookingType(req.getBookingType())
            .totalDays((int) billingDays).totalPrice(total)
            .status(Booking.Status.CONFIRMED)
            .build();
        booking = bookingRepository.save(booking);

        car.setStatus(Car.Status.BOOKED);
        carRepository.save(car);

        return ResponseEntity.ok(toDto(booking));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Booking b = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!status.equals("CONFIRMED") && !status.equals("CANCELLED")) {
            return ResponseEntity.badRequest().body("Invalid status. Only CONFIRMED or CANCELLED allowed.");
        }
        b.setStatus(Booking.Status.valueOf(status));
        if ("CANCELLED".equals(status)) {
            b.getCar().setStatus(Car.Status.AVAILABLE);
            carRepository.save(b.getCar());
        }
        return ResponseEntity.ok(toDto(bookingRepository.save(b)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking b = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        b.setStatus(Booking.Status.CANCELLED);
        b.getCar().setStatus(Car.Status.AVAILABLE);
        carRepository.save(b.getCar());
        bookingRepository.save(b);
        return ResponseEntity.ok().build();
    }

    BookingDto toDto(Booking b) {
        return BookingDto.builder()
            .bookingId(b.getBookingId())
            .customerId(b.getCustomer().getCustomerId())
            .customerName(b.getCustomer().getFullName())
            .carId(b.getCar().getCarId())
            .companyName(b.getCar().getCompany().getCompanyName())
            .variantName(b.getCar().getVariant().getVariantName())
            .registrationNo(b.getCar().getRegistrationNo())
            .carDetails(b.getCar().getCompany().getCompanyName() + " " +
                        b.getCar().getVariant().getVariantName())
            .pickupDate(b.getPickupDate()).returnDate(b.getReturnDate())
            .pickupTime(b.getPickupTime()).returnTime(b.getReturnTime())
            .destination(b.getDestination()).phone(b.getPhone())
            .paymentMethod(b.getPaymentMethod()).bookingType(b.getBookingType())
            .totalDays(b.getTotalDays()).totalPrice(b.getTotalPrice())
            .status(b.getStatus().name()).createdAt(b.getCreatedAt())
            .build();
    }
}
