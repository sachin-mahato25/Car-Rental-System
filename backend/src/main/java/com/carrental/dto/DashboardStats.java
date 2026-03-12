package com.carrental.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private long totalCars, availableCars, totalCustomers, totalBookings, activeBookings;
    private BigDecimal totalRevenue;

    public DashboardStats() {}
    public DashboardStats(long totalCars, long availableCars, long totalCustomers,
                          long totalBookings, long activeBookings, BigDecimal totalRevenue) {
        this.totalCars = totalCars; this.availableCars = availableCars;
        this.totalCustomers = totalCustomers; this.totalBookings = totalBookings;
        this.activeBookings = activeBookings; this.totalRevenue = totalRevenue;
    }

    public long       getTotalCars()       { return totalCars; }
    public long       getAvailableCars()   { return availableCars; }
    public long       getTotalCustomers()  { return totalCustomers; }
    public long       getTotalBookings()   { return totalBookings; }
    public long       getActiveBookings()  { return activeBookings; }
    public BigDecimal getTotalRevenue()    { return totalRevenue; }
}
