package com.app.shoppingtally.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.shoppingtally.user.User;

import jakarta.persistence.Tuple;


public interface UserRepo extends JpaRepository<User, Long>{
	void deleteUserById(Long id);
	Optional<User> findUserById(Long id);
	Optional<User> findByEmail(String email);
}
