package com.app.shoppingtally.shopping;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.shoppingtally.user.User;

public interface CurrentOrderRepo extends JpaRepository<CurrentOrderEntity, Long>{
	CurrentOrderEntity findUserById(Long id);
	CurrentOrderEntity findByDate(String date);
}
