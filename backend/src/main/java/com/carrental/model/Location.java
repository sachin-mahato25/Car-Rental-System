package com.carrental.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(nullable = false, length = 150)
    private String locationName;

    private String city;
    private String state;
    private String pincode;

    @Column(columnDefinition = "TEXT")
    private String address;

    public Location() {}

    public Long   getLocationId()           { return locationId; }
    public void   setLocationId(Long v)     { this.locationId = v; }
    public String getLocationName()         { return locationName; }
    public void   setLocationName(String v) { this.locationName = v; }
    public String getCity()                 { return city; }
    public void   setCity(String v)         { this.city = v; }
    public String getState()                { return state; }
    public void   setState(String v)        { this.state = v; }
    public String getPincode()              { return pincode; }
    public void   setPincode(String v)      { this.pincode = v; }
    public String getAddress()              { return address; }
    public void   setAddress(String v)      { this.address = v; }
}
