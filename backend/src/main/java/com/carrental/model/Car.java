package com.carrental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private CarCompany company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id", nullable = false)
    private CarVariant variant;

    @Column(unique = true, nullable = false, length = 50)
    private String registrationNo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private Location location;

    private String  color;
    private Integer year;
    private String  imageUrl;

    public enum Status { AVAILABLE, BOOKED, MAINTENANCE }

    public Car() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long carId; private CarCompany company; private CarVariant variant;
        private String registrationNo; private BigDecimal pricePerDay;
        private Status status = Status.AVAILABLE; private Location location;
        private String color, imageUrl; private Integer year;

        public Builder carId(Long v)             { this.carId = v;           return this; }
        public Builder company(CarCompany v)     { this.company = v;         return this; }
        public Builder variant(CarVariant v)     { this.variant = v;         return this; }
        public Builder registrationNo(String v)  { this.registrationNo = v;  return this; }
        public Builder pricePerDay(BigDecimal v) { this.pricePerDay = v;     return this; }
        public Builder status(Status v)          { this.status = v;          return this; }
        public Builder location(Location v)      { this.location = v;        return this; }
        public Builder color(String v)           { this.color = v;           return this; }
        public Builder year(Integer v)           { this.year = v;            return this; }
        public Builder imageUrl(String v)        { this.imageUrl = v;        return this; }
        public Car build() {
            Car c = new Car();
            c.carId = carId; c.company = company; c.variant = variant;
            c.registrationNo = registrationNo; c.pricePerDay = pricePerDay;
            c.status = status; c.location = location;
            c.color = color; c.year = year; c.imageUrl = imageUrl;
            return c;
        }
    }

    public Long       getCarId()                   { return carId; }
    public void       setCarId(Long v)             { this.carId = v; }
    public CarCompany getCompany()                 { return company; }
    public void       setCompany(CarCompany v)     { this.company = v; }
    public CarVariant getVariant()                 { return variant; }
    public void       setVariant(CarVariant v)     { this.variant = v; }
    public String     getRegistrationNo()          { return registrationNo; }
    public void       setRegistrationNo(String v)  { this.registrationNo = v; }
    public BigDecimal getPricePerDay()             { return pricePerDay; }
    public void       setPricePerDay(BigDecimal v) { this.pricePerDay = v; }
    public Status     getStatus()                  { return status; }
    public void       setStatus(Status v)          { this.status = v; }
    public Location   getLocation()                { return location; }
    public void       setLocation(Location v)      { this.location = v; }
    public String     getColor()                   { return color; }
    public void       setColor(String v)           { this.color = v; }
    public Integer    getYear()                    { return year; }
    public void       setYear(Integer v)           { this.year = v; }
    public String     getImageUrl()                { return imageUrl; }
    public void       setImageUrl(String v)        { this.imageUrl = v; }
}
