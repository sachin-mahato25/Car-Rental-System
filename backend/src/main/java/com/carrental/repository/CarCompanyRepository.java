package com.carrental.repository;

import com.carrental.model.CarCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarCompanyRepository extends JpaRepository<CarCompany, Long> {
}
