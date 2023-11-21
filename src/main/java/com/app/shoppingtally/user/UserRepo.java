package com.app.shoppingtally.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.shoppingtally.user.User;

import jakarta.persistence.Tuple;


public interface UserRepo extends JpaRepository<User, Long>{
	void deleteUserById(Long id);
	Optional<User> findUserById(Long id);
	Optional<User> findByEmail(String email);
	
	@Query(value="SELECT socket_key FROM _user WHERE id=:id", nativeQuery=true)
	String getSocketKeyById(@Param("id")Long id);
	
	@Query(value="SELECT socket_key FROM _user WHERE shopper_id=:id", nativeQuery=true)
	String getSocketKeyByShopperId(@Param("id")int id);
}
