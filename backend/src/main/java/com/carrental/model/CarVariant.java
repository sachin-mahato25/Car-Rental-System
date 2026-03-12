package com.carrental.model;

import jakarta.persistence.*;

@Entity
@Table(name = "car_variants")
public class CarVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CarCompany company;

    @Column(nullable = false, length = 100)
    private String variantName;

    private String  fuelType;
    private String  transmission;
    private Integer seatingCapacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    public CarVariant() {}

    public Long       getVariantId()                { return variantId; }
    public void       setVariantId(Long v)          { this.variantId = v; }
    public CarCompany getCompany()                  { return company; }
    public void       setCompany(CarCompany v)      { this.company = v; }
    public String     getVariantName()              { return variantName; }
    public void       setVariantName(String v)      { this.variantName = v; }
    public String     getFuelType()                 { return fuelType; }
    public void       setFuelType(String v)         { this.fuelType = v; }
    public String     getTransmission()             { return transmission; }
    public void       setTransmission(String v)     { this.transmission = v; }
    public Integer    getSeatingCapacity()          { return seatingCapacity; }
    public void       setSeatingCapacity(Integer v) { this.seatingCapacity = v; }
    public String     getDescription()              { return description; }
    public void       setDescription(String v)      { this.description = v; }
}
