package com.app.shoppingtally.list;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface ListRepository extends JpaRepository<UserList,Long>{
	@Query(value="SELECT * FROM user_list WHERE user_id=:fid", nativeQuery=true)
	List<UserList> findByUserId(@Param("fid") Long fid);
	
	@Query(value="SELECT date FROM user_list", nativeQuery=true)
	List<String> getAllUserDates();
}
