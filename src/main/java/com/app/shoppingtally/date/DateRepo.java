package com.app.shoppingtally.date;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DateRepo extends JpaRepository<Date, Long>{
	List<Date> findByFid(Long fid);
}
