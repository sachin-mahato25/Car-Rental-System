package com.carrental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum Role { ADMIN, CUSTOMER }

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }

    public User() {}

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long userId; private String username, password; private Role role;
        public Builder userId(Long v)    { this.userId = v;   return this; }
        public Builder username(String v){ this.username = v; return this; }
        public Builder password(String v){ this.password = v; return this; }
        public Builder role(Role v)      { this.role = v;     return this; }
        public User build() {
            User u = new User();
            u.userId = userId; u.username = username;
            u.password = password; u.role = role;
            return u;
        }
    }

    // Getters & Setters
    public Long          getUserId()           { return userId; }
    public void          setUserId(Long v)     { this.userId = v; }
    public String        getUsername()         { return username; }
    public void          setUsername(String v) { this.username = v; }
    public String        getPassword()         { return password; }
    public void          setPassword(String v) { this.password = v; }
    public Role          getRole()             { return role; }
    public void          setRole(Role v)       { this.role = v; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
}
