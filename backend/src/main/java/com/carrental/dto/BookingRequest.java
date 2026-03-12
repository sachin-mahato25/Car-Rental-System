package com.carrental.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {
    @NotNull private Long carId;
    @NotNull private LocalDate pickupDate;
    @NotNull private LocalDate returnDate;
    private String pickupTime;
    private String returnTime;
    private String destination;
    private String phone;
    private String paymentMethod;
    private String bookingType;

    public Long      getCarId()          { return carId; }
    public void      setCarId(Long v)    { this.carId = v; }
    public LocalDate getPickupDate()     { return pickupDate; }
    public void      setPickupDate(LocalDate v) { this.pickupDate = v; }
    public LocalDate getReturnDate()     { return returnDate; }
    public void      setReturnDate(LocalDate v) { this.returnDate = v; }
    public String    getPickupTime()     { return pickupTime; }
    public void      setPickupTime(String v)    { this.pickupTime = v; }
    public String    getReturnTime()     { return returnTime; }
    public void      setReturnTime(String v)    { this.returnTime = v; }
    public String    getDestination()    { return destination; }
    public void      setDestination(String v)   { this.destination = v; }
    public String    getPhone()          { return phone; }
    public void      setPhone(String v)  { this.phone = v; }
    public String    getPaymentMethod()  { return paymentMethod; }
    public void      setPaymentMethod(String v) { this.paymentMethod = v; }
    public String    getBookingType()    { return bookingType; }
    public void      setBookingType(String v)   { this.bookingType = v; }
}
