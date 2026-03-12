package com.carrental.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDto {
    private Long bookingId, customerId, carId;
    private String customerName, carDetails, companyName, variantName, registrationNo, status;
    private String pickupTime, returnTime, destination, phone, paymentMethod, bookingType;
    private LocalDate pickupDate, returnDate;
    private Integer totalDays;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;

    public BookingDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final BookingDto dto = new BookingDto();
        public Builder bookingId(Long v)          { dto.bookingId = v;       return this; }
        public Builder customerId(Long v)         { dto.customerId = v;      return this; }
        public Builder customerName(String v)     { dto.customerName = v;    return this; }
        public Builder carId(Long v)              { dto.carId = v;           return this; }
        public Builder carDetails(String v)       { dto.carDetails = v;      return this; }
        public Builder companyName(String v)      { dto.companyName = v;     return this; }
        public Builder variantName(String v)      { dto.variantName = v;     return this; }
        public Builder registrationNo(String v)   { dto.registrationNo = v;  return this; }
        public Builder pickupDate(LocalDate v)    { dto.pickupDate = v;      return this; }
        public Builder returnDate(LocalDate v)    { dto.returnDate = v;      return this; }
        public Builder pickupTime(String v)       { dto.pickupTime = v;      return this; }
        public Builder returnTime(String v)       { dto.returnTime = v;      return this; }
        public Builder destination(String v)      { dto.destination = v;     return this; }
        public Builder phone(String v)            { dto.phone = v;           return this; }
        public Builder paymentMethod(String v)    { dto.paymentMethod = v;   return this; }
        public Builder bookingType(String v)      { dto.bookingType = v;     return this; }
        public Builder totalDays(Integer v)       { dto.totalDays = v;       return this; }
        public Builder totalPrice(BigDecimal v)   { dto.totalPrice = v;      return this; }
        public Builder status(String v)           { dto.status = v;          return this; }
        public Builder createdAt(LocalDateTime v) { dto.createdAt = v;       return this; }
        public BookingDto build()                 { return dto; }
    }

    public Long          getBookingId()       { return bookingId; }
    public Long          getCustomerId()      { return customerId; }
    public String        getCustomerName()    { return customerName; }
    public Long          getCarId()           { return carId; }
    public String        getCarDetails()      { return carDetails; }
    public String        getCompanyName()     { return companyName; }
    public String        getVariantName()     { return variantName; }
    public String        getRegistrationNo()  { return registrationNo; }
    public LocalDate     getPickupDate()      { return pickupDate; }
    public LocalDate     getReturnDate()      { return returnDate; }
    public String        getPickupTime()      { return pickupTime; }
    public String        getReturnTime()      { return returnTime; }
    public String        getDestination()     { return destination; }
    public String        getPhone()           { return phone; }
    public String        getPaymentMethod()   { return paymentMethod; }
    public String        getBookingType()     { return bookingType; }
    public Integer       getTotalDays()       { return totalDays; }
    public BigDecimal    getTotalPrice()      { return totalPrice; }
    public String        getStatus()          { return status; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
}
