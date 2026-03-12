package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CarRequest {
    @NotNull  public Long       companyId;
    @NotNull  public Long       variantId;
    @NotBlank public String     registrationNo;
    @NotNull  public BigDecimal pricePerDay;
    public String  status;
    public Long    locationId;
    public String  color;
    public Integer year;
    public String  imageUrl;

    public CarRequest() {}
    public Long       getCompanyId()              { return companyId; }
    public void       setCompanyId(Long v)        { this.companyId = v; }
    public Long       getVariantId()              { return variantId; }
    public void       setVariantId(Long v)        { this.variantId = v; }
    public String     getRegistrationNo()         { return registrationNo; }
    public void       setRegistrationNo(String v) { this.registrationNo = v; }
    public BigDecimal getPricePerDay()            { return pricePerDay; }
    public void       setPricePerDay(BigDecimal v){ this.pricePerDay = v; }
    public String     getStatus()                 { return status; }
    public void       setStatus(String v)         { this.status = v; }
    public Long       getLocationId()             { return locationId; }
    public void       setLocationId(Long v)       { this.locationId = v; }
    public String     getColor()                  { return color; }
    public void       setColor(String v)          { this.color = v; }
    public Integer    getYear()                   { return year; }
    public void       setYear(Integer v)          { this.year = v; }
    public String     getImageUrl()               { return imageUrl; }
    public void       setImageUrl(String v)       { this.imageUrl = v; }
}
