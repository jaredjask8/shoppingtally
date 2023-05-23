package com.app.shoppingtally.repo;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.shoppingtally.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long>{
	void deleteEmployeeById(Long id);
	Optional<Employee> findEmployeeById(Long id);
}
