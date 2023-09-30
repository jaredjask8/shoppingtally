package com.app.shoppingtally.admin.whatsNew;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WhatsNewRepo extends JpaRepository<WhatsNew,Long>{
	
	Optional<WhatsNew> findById(Long id);
}
