package com.carrental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(nullable = false)
    private LocalDate pickupDate;

    @Column(nullable = false)
    private LocalDate returnDate;

    private String pickupTime;
    private String returnTime;
    private String destination;
    private String phone;
    private String paymentMethod;
    private String bookingType;

    private Integer    totalDays;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum Status { PENDING, CONFIRMED, COMPLETED, CANCELLED }

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }

    public Booking() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long bookingId; private Customer customer; private Car car;
        private LocalDate pickupDate, returnDate;
        private String pickupTime, returnTime, destination, phone, paymentMethod, bookingType;
        private Integer totalDays; private BigDecimal totalPrice;
        private Status status = Status.PENDING;

        public Builder bookingId(Long v)          { this.bookingId = v;      return this; }
        public Builder customer(Customer v)       { this.customer = v;       return this; }
        public Builder car(Car v)                 { this.car = v;            return this; }
        public Builder pickupDate(LocalDate v)    { this.pickupDate = v;     return this; }
        public Builder returnDate(LocalDate v)    { this.returnDate = v;     return this; }
        public Builder pickupTime(String v)       { this.pickupTime = v;     return this; }
        public Builder returnTime(String v)       { this.returnTime = v;     return this; }
        public Builder destination(String v)      { this.destination = v;    return this; }
        public Builder phone(String v)            { this.phone = v;          return this; }
        public Builder paymentMethod(String v)    { this.paymentMethod = v;  return this; }
        public Builder bookingType(String v)      { this.bookingType = v;    return this; }
        public Builder totalDays(Integer v)       { this.totalDays = v;      return this; }
        public Builder totalPrice(BigDecimal v)   { this.totalPrice = v;     return this; }
        public Builder status(Status v)           { this.status = v;         return this; }
        public Booking build() {
            Booking b = new Booking();
            b.bookingId = bookingId; b.customer = customer; b.car = car;
            b.pickupDate = pickupDate; b.returnDate = returnDate;
            b.pickupTime = pickupTime; b.returnTime = returnTime;
            b.destination = destination; b.phone = phone;
            b.paymentMethod = paymentMethod; b.bookingType = bookingType;
            b.totalDays = totalDays; b.totalPrice = totalPrice; b.status = status;
            return b;
        }
    }

    public Long          getBookingId()                  { return bookingId; }
    public void          setBookingId(Long v)            { this.bookingId = v; }
    public Customer      getCustomer()                   { return customer; }
    public void          setCustomer(Customer v)         { this.customer = v; }
    public Car           getCar()                        { return car; }
    public void          setCar(Car v)                   { this.car = v; }
    public LocalDate     getPickupDate()                 { return pickupDate; }
    public void          setPickupDate(LocalDate v)      { this.pickupDate = v; }
    public LocalDate     getReturnDate()                 { return returnDate; }
    public void          setReturnDate(LocalDate v)      { this.returnDate = v; }
    public String        getPickupTime()                 { return pickupTime; }
    public void          setPickupTime(String v)         { this.pickupTime = v; }
    public String        getReturnTime()                 { return returnTime; }
    public void          setReturnTime(String v)         { this.returnTime = v; }
    public String        getDestination()                { return destination; }
    public void          setDestination(String v)        { this.destination = v; }
    public String        getPhone()                      { return phone; }
    public void          setPhone(String v)              { this.phone = v; }
    public String        getPaymentMethod()              { return paymentMethod; }
    public void          setPaymentMethod(String v)      { this.paymentMethod = v; }
    public String        getBookingType()                { return bookingType; }
    public void          setBookingType(String v)        { this.bookingType = v; }
    public Integer       getTotalDays()                  { return totalDays; }
    public void          setTotalDays(Integer v)         { this.totalDays = v; }
    public BigDecimal    getTotalPrice()                 { return totalPrice; }
    public void          setTotalPrice(BigDecimal v)     { this.totalPrice = v; }
    public Status        getStatus()                     { return status; }
    public void          setStatus(Status v)             { this.status = v; }
    public LocalDateTime getCreatedAt()                  { return createdAt; }
}
