package com.carrental.dto;

import com.carrental.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {
    @NotBlank public String username;
    @NotBlank public String password;
    @NotNull  public User.Role role;

    public LoginRequest() {}
    public String    getUsername() { return username; }
    public void      setUsername(String v) { this.username = v; }
    public String    getPassword() { return password; }
    public void      setPassword(String v) { this.password = v; }
    public User.Role getRole()     { return role; }
    public void      setRole(User.Role v) { this.role = v; }
}
