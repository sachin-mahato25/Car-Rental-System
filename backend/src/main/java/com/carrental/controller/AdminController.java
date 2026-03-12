package com.carrental.controller;
import com.carrental.dto.CustomerDto;
import com.carrental.dto.DashboardStats;
import com.carrental.model.*;
import com.carrental.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired private CarRepository        carRepository;
    @Autowired private CustomerRepository   customerRepository;
    @Autowired private BookingRepository    bookingRepository;
    @Autowired private PaymentRepository    paymentRepository;
    @Autowired private CarCompanyRepository companyRepository;
    @Autowired private LocationRepository   locationRepository;

    @GetMapping("/dashboard")
    public DashboardStats getDashboard() {
        long totalCars      = carRepository.count();
        long availableCars  = carRepository.findByStatus(Car.Status.AVAILABLE).size();
        long totalCustomers = customerRepository.count();
        long totalBookings  = bookingRepository.count();
        long activeBookings = bookingRepository.findByStatus(Booking.Status.CONFIRMED).size();

        // Calculate revenue from all non-cancelled bookings
        BigDecimal revenue = bookingRepository.findAll().stream()
            .filter(b -> b.getStatus() != Booking.Status.CANCELLED)
            .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardStats(totalCars, availableCars, totalCustomers,
                                  totalBookings, activeBookings, revenue);
    }

    @GetMapping("/customers")
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream().map(c ->
            CustomerDto.builder()
                .customerId(c.getCustomerId())
                .userId(c.getUser() != null ? c.getUser().getUserId() : null)
                .fullName(c.getFullName()).email(c.getEmail())
                .phone(c.getPhone()).address(c.getAddress()).licenseNo(c.getLicenseNo())
                .build()
        ).collect(Collectors.toList());
    }

    @GetMapping("/companies")
    public List<CarCompany> getCompanies() { return companyRepository.findAll(); }
    @PostMapping("/companies")
    public CarCompany addCompany(@RequestBody CarCompany c) { return companyRepository.save(c); }
    @PutMapping("/companies/{id}")
    public CarCompany updateCompany(@PathVariable Long id, @RequestBody CarCompany c) {
        c.setCompanyId(id);
        return companyRepository.save(c);
    }
    @DeleteMapping("/companies/{id}")
    public void deleteCompany(@PathVariable Long id) { companyRepository.deleteById(id); }

    @GetMapping("/locations")
    public List<Location> getLocations() { return locationRepository.findAll(); }
    @PostMapping("/locations")
    public Location addLocation(@RequestBody Location l) { return locationRepository.save(l); }
    @PutMapping("/locations/{id}")
    public Location updateLocation(@PathVariable Long id, @RequestBody Location l) {
        l.setLocationId(id);
        return locationRepository.save(l);
    }
    @DeleteMapping("/locations/{id}")
    public void deleteLocation(@PathVariable Long id) { locationRepository.deleteById(id); }
}
