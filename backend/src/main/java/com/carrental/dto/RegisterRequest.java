package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank @Size(min=3,max=50) public String username;
    @NotBlank @Size(min=6)        public String password;
    @NotBlank                     public String fullName;
    public String email, phone, address, licenseNo;

    public RegisterRequest() {}
    public String getUsername()  { return username; }
    public void setUsername(String v)  { this.username = v; }
    public String getPassword()  { return password; }
    public void setPassword(String v)  { this.password = v; }
    public String getFullName()  { return fullName; }
    public void setFullName(String v)  { this.fullName = v; }
    public String getEmail()     { return email; }
    public void setEmail(String v)     { this.email = v; }
    public String getPhone()     { return phone; }
    public void setPhone(String v)     { this.phone = v; }
    public String getAddress()   { return address; }
    public void setAddress(String v)   { this.address = v; }
    public String getLicenseNo() { return licenseNo; }
    public void setLicenseNo(String v) { this.licenseNo = v; }
}
