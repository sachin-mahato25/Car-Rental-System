package com.carrental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(unique = true, length = 150)
    private String email;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String licenseNo;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }

    public Customer() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long customerId; private User user; private String fullName;
        private String email, phone, address, licenseNo;
        public Builder customerId(Long v)  { this.customerId = v; return this; }
        public Builder user(User v)        { this.user = v;       return this; }
        public Builder fullName(String v)  { this.fullName = v;   return this; }
        public Builder email(String v)     { this.email = v;      return this; }
        public Builder phone(String v)     { this.phone = v;      return this; }
        public Builder address(String v)   { this.address = v;    return this; }
        public Builder licenseNo(String v) { this.licenseNo = v;  return this; }
        public Customer build() {
            Customer c = new Customer();
            c.customerId = customerId; c.user = user; c.fullName = fullName;
            c.email = email; c.phone = phone; c.address = address; c.licenseNo = licenseNo;
            return c;
        }
    }

    public Long          getCustomerId()           { return customerId; }
    public void          setCustomerId(Long v)     { this.customerId = v; }
    public User          getUser()                 { return user; }
    public void          setUser(User v)           { this.user = v; }
    public String        getFullName()             { return fullName; }
    public void          setFullName(String v)     { this.fullName = v; }
    public String        getEmail()                { return email; }
    public void          setEmail(String v)        { this.email = v; }
    public String        getPhone()                { return phone; }
    public void          setPhone(String v)        { this.phone = v; }
    public String        getAddress()              { return address; }
    public void          setAddress(String v)      { this.address = v; }
    public String        getLicenseNo()            { return licenseNo; }
    public void          setLicenseNo(String v)    { this.licenseNo = v; }
    public LocalDateTime getCreatedAt()            { return createdAt; }
}
