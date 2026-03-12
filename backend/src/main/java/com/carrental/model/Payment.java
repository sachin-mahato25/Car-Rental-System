package com.carrental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", unique = true, nullable = false)
    private Booking booking;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private String paymentMode;
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String transactionId;

    public enum Status { PAID, PENDING, REFUNDED }

    @PrePersist
    public void prePersist() { this.paymentDate = LocalDateTime.now(); }

    public Payment() {}

    public Long          getPaymentId()                 { return paymentId; }
    public void          setPaymentId(Long v)           { this.paymentId = v; }
    public Booking       getBooking()                   { return booking; }
    public void          setBooking(Booking v)          { this.booking = v; }
    public BigDecimal    getAmount()                    { return amount; }
    public void          setAmount(BigDecimal v)        { this.amount = v; }
    public String        getPaymentMode()               { return paymentMode; }
    public void          setPaymentMode(String v)       { this.paymentMode = v; }
    public LocalDateTime getPaymentDate()               { return paymentDate; }
    public void          setPaymentDate(LocalDateTime v){ this.paymentDate = v; }
    public Status        getStatus()                    { return status; }
    public void          setStatus(Status v)            { this.status = v; }
    public String        getTransactionId()             { return transactionId; }
    public void          setTransactionId(String v)     { this.transactionId = v; }
}
