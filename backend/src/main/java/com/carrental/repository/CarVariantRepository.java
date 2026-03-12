package com.carrental.repository;

import com.carrental.model.CarVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarVariantRepository extends JpaRepository<CarVariant, Long> {
    List<CarVariant> findByCompany_CompanyId(Long companyId);
}
