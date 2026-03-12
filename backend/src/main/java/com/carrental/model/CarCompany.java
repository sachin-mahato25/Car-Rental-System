package com.carrental.model;

import jakarta.persistence.*;

@Entity
@Table(name = "car_companies")
public class CarCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @Column(unique = true, nullable = false, length = 100)
    private String companyName;

    private String country;

    @Column(columnDefinition = "TEXT")
    private String description;

    public CarCompany() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long companyId; private String companyName, country, description;
        public Builder companyId(Long v)     { this.companyId = v;   return this; }
        public Builder companyName(String v) { this.companyName = v; return this; }
        public Builder country(String v)     { this.country = v;     return this; }
        public Builder description(String v) { this.description = v; return this; }
        public CarCompany build() {
            CarCompany c = new CarCompany();
            c.companyId = companyId; c.companyName = companyName;
            c.country = country; c.description = description;
            return c;
        }
    }

    public Long   getCompanyId()           { return companyId; }
    public void   setCompanyId(Long v)     { this.companyId = v; }
    public String getCompanyName()         { return companyName; }
    public void   setCompanyName(String v) { this.companyName = v; }
    public String getCountry()             { return country; }
    public void   setCountry(String v)     { this.country = v; }
    public String getDescription()         { return description; }
    public void   setDescription(String v) { this.description = v; }
}
