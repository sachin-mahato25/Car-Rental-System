package com.carrental.controller;

import com.carrental.dto.CarDto;
import com.carrental.dto.CarRequest;
import com.carrental.model.Car;
import com.carrental.model.CarCompany;
import com.carrental.model.CarVariant;
import com.carrental.model.Location;
import com.carrental.repository.CarCompanyRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CarVariantRepository;
import com.carrental.repository.LocationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CarController {

    @Autowired private CarRepository        carRepository;
    @Autowired private CarCompanyRepository companyRepository;
    @Autowired private CarVariantRepository variantRepository;
    @Autowired private LocationRepository   locationRepository;

    @GetMapping("/cars")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CarDto> getAllCars() {
        return carRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/cars/available")
    public List<CarDto> getAvailableCars() {
        return carRepository.findByStatus(Car.Status.AVAILABLE)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/cars/{id}")
    public ResponseEntity<CarDto> getCar(@PathVariable Long id) {
        return carRepository.findById(id)
            .map(c -> ResponseEntity.ok(toDto(c)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cars/company/{companyId}")
    public List<CarDto> getCarsByCompany(@PathVariable Long companyId) {
        return carRepository.findByCompany_CompanyId(companyId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping("/admin/cars")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCar(@Valid @RequestBody CarRequest req) {
        CarCompany company = companyRepository.findById(req.getCompanyId())
            .orElseThrow(() -> new RuntimeException("Company not found"));
        CarVariant variant = variantRepository.findById(req.getVariantId())
            .orElseThrow(() -> new RuntimeException("Variant not found"));
        Location location = (req.getLocationId() != null)
            ? locationRepository.findById(req.getLocationId()).orElse(null) : null;

        Car car = Car.builder()
            .company(company).variant(variant)
            .registrationNo(req.getRegistrationNo())
            .pricePerDay(req.getPricePerDay())
            .status(req.getStatus() != null ? Car.Status.valueOf(req.getStatus()) : Car.Status.AVAILABLE)
            .location(location)
            .color(req.getColor()).year(req.getYear()).imageUrl(req.getImageUrl())
            .build();

        return ResponseEntity.ok(toDto(carRepository.save(car)));
    }

    @PutMapping("/admin/cars/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest req) {
        Car car = carRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car not found"));

        car.setCompany(companyRepository.findById(req.getCompanyId()).orElseThrow());
        car.setVariant(variantRepository.findById(req.getVariantId()).orElseThrow());
        car.setRegistrationNo(req.getRegistrationNo());
        car.setPricePerDay(req.getPricePerDay());
        if (req.getStatus() != null) car.setStatus(Car.Status.valueOf(req.getStatus()));
        if (req.getLocationId() != null)
            car.setLocation(locationRepository.findById(req.getLocationId()).orElse(null));
        car.setColor(req.getColor());
        car.setYear(req.getYear());
        car.setImageUrl(req.getImageUrl());

        return ResponseEntity.ok(toDto(carRepository.save(car)));
    }

    @DeleteMapping("/admin/cars/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        carRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    CarDto toDto(Car c) {
        return CarDto.builder()
            .carId(c.getCarId())
            .companyId(c.getCompany().getCompanyId())
            .companyName(c.getCompany().getCompanyName())
            .variantId(c.getVariant().getVariantId())
            .variantName(c.getVariant().getVariantName())
            .registrationNo(c.getRegistrationNo())
            .pricePerDay(c.getPricePerDay())
            .status(c.getStatus().name())
            .locationId(c.getLocation() != null ? c.getLocation().getLocationId() : null)
            .locationName(c.getLocation() != null ? c.getLocation().getLocationName() : null)
            .color(c.getColor()).year(c.getYear()).imageUrl(c.getImageUrl())
            .fuelType(c.getVariant().getFuelType())
            .transmission(c.getVariant().getTransmission())
            .seatingCapacity(c.getVariant().getSeatingCapacity())
            .build();
    }
}
