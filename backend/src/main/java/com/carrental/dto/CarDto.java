package com.carrental.dto;

import java.math.BigDecimal;

public class CarDto {
    private Long carId, companyId, variantId, locationId;
    private String companyName, variantName, registrationNo, status;
    private String locationName, color, imageUrl, fuelType, transmission;
    private BigDecimal pricePerDay;
    private Integer year, seatingCapacity;

    public CarDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final CarDto dto = new CarDto();
        public Builder carId(Long v)              { dto.carId = v;           return this; }
        public Builder companyId(Long v)          { dto.companyId = v;       return this; }
        public Builder companyName(String v)      { dto.companyName = v;     return this; }
        public Builder variantId(Long v)          { dto.variantId = v;       return this; }
        public Builder variantName(String v)      { dto.variantName = v;     return this; }
        public Builder registrationNo(String v)   { dto.registrationNo = v;  return this; }
        public Builder pricePerDay(BigDecimal v)  { dto.pricePerDay = v;     return this; }
        public Builder status(String v)           { dto.status = v;          return this; }
        public Builder locationId(Long v)         { dto.locationId = v;      return this; }
        public Builder locationName(String v)     { dto.locationName = v;    return this; }
        public Builder color(String v)            { dto.color = v;           return this; }
        public Builder year(Integer v)            { dto.year = v;            return this; }
        public Builder imageUrl(String v)         { dto.imageUrl = v;        return this; }
        public Builder fuelType(String v)         { dto.fuelType = v;        return this; }
        public Builder transmission(String v)     { dto.transmission = v;    return this; }
        public Builder seatingCapacity(Integer v) { dto.seatingCapacity = v; return this; }
        public CarDto build()                     { return dto; }
    }

    public Long       getCarId()             { return carId; }
    public void       setCarId(Long v)       { this.carId = v; }
    public Long       getCompanyId()         { return companyId; }
    public void       setCompanyId(Long v)   { this.companyId = v; }
    public String     getCompanyName()       { return companyName; }
    public void       setCompanyName(String v){ this.companyName = v; }
    public Long       getVariantId()         { return variantId; }
    public void       setVariantId(Long v)   { this.variantId = v; }
    public String     getVariantName()       { return variantName; }
    public void       setVariantName(String v){ this.variantName = v; }
    public String     getRegistrationNo()    { return registrationNo; }
    public void       setRegistrationNo(String v){ this.registrationNo = v; }
    public BigDecimal getPricePerDay()       { return pricePerDay; }
    public void       setPricePerDay(BigDecimal v){ this.pricePerDay = v; }
    public String     getStatus()            { return status; }
    public void       setStatus(String v)    { this.status = v; }
    public Long       getLocationId()        { return locationId; }
    public void       setLocationId(Long v)  { this.locationId = v; }
    public String     getLocationName()      { return locationName; }
    public void       setLocationName(String v){ this.locationName = v; }
    public String     getColor()             { return color; }
    public void       setColor(String v)     { this.color = v; }
    public Integer    getYear()              { return year; }
    public void       setYear(Integer v)     { this.year = v; }
    public String     getImageUrl()          { return imageUrl; }
    public void       setImageUrl(String v)  { this.imageUrl = v; }
    public String     getFuelType()          { return fuelType; }
    public void       setFuelType(String v)  { this.fuelType = v; }
    public String     getTransmission()      { return transmission; }
    public void       setTransmission(String v){ this.transmission = v; }
    public Integer    getSeatingCapacity()   { return seatingCapacity; }
    public void       setSeatingCapacity(Integer v){ this.seatingCapacity = v; }
}
