package com.carrental.dto;

public class AuthResponse {
    private String token, username, role, fullName;
    private Long userId, customerId;

    public AuthResponse() {}
    public AuthResponse(String token, String username, String role,
                        Long userId, Long customerId, String fullName) {
        this.token = token; this.username = username; this.role = role;
        this.userId = userId; this.customerId = customerId; this.fullName = fullName;
    }

    public String getToken()      { return token; }
    public void setToken(String v){ this.token = v; }
    public String getUsername()   { return username; }
    public void setUsername(String v){ this.username = v; }
    public String getRole()       { return role; }
    public void setRole(String v) { this.role = v; }
    public Long getUserId()       { return userId; }
    public void setUserId(Long v) { this.userId = v; }
    public Long getCustomerId()   { return customerId; }
    public void setCustomerId(Long v){ this.customerId = v; }
    public String getFullName()   { return fullName; }
    public void setFullName(String v){ this.fullName = v; }
}
