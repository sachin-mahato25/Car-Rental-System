package com.carrental.dto;

public class CustomerDto {
    private Long customerId, userId;
    private String fullName, email, phone, address, licenseNo;

    public CustomerDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final CustomerDto dto = new CustomerDto();
        public Builder customerId(Long v)  { dto.customerId = v; return this; }
        public Builder userId(Long v)      { dto.userId = v;     return this; }
        public Builder fullName(String v)  { dto.fullName = v;   return this; }
        public Builder email(String v)     { dto.email = v;      return this; }
        public Builder phone(String v)     { dto.phone = v;      return this; }
        public Builder address(String v)   { dto.address = v;    return this; }
        public Builder licenseNo(String v) { dto.licenseNo = v;  return this; }
        public CustomerDto build()         { return dto; }
    }

    public Long   getCustomerId() { return customerId; }
    public Long   getUserId()     { return userId; }
    public String getFullName()   { return fullName; }
    public String getEmail()      { return email; }
    public String getPhone()      { return phone; }
    public String getAddress()    { return address; }
    public String getLicenseNo()  { return licenseNo; }
}
