package com.app.shoppingtally.list;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.shoppingtally.list.models.CurrentOrder;
import com.app.shoppingtally.list.models.ShopperOrders;
import com.app.shoppingtally.shopping.CurrentOrderEntity;
import com.app.shoppingtally.user.User;



public interface ListRepository extends JpaRepository<UserList,Long>{
	@Query(value="SELECT * FROM user_list WHERE user_id=:fid", nativeQuery=true)
	List<UserList> findByUserId(@Param("fid") Long fid);
	
	@Query(value="SELECT * FROM user_list WHERE user_id=:fid AND is_current_order='true'", nativeQuery=true)
	List<UserList> findByCurrentOrder(@Param("fid") Long fid);
	
	@Query(value="SELECT * FROM user_list WHERE user_id=:fid AND is_current_order='true'", nativeQuery=true)
	UserList getUserListByCurrentOrder(@Param("fid") Long fid);
	
	@Query(value="SELECT date FROM user_list", nativeQuery=true)
	List<String> getAllUserDates();
	
	/////JAY////
	@Query(value="SELECT date FROM user_list WHERE shopper_id = 1", nativeQuery=true)
	List<String> getJaysOrderDates();
	
	@Query(value="SELECT date,list,user_id,is_active,is_completed FROM user_list WHERE shopper_id = 1", nativeQuery=true)
	List<List<String>> getJaysFullOrders();
	
	/////JOSH////
	@Query(value="SELECT date FROM user_list WHERE shopper_id = 2", nativeQuery=true)
	List<String> getJoshsOrderDates();
	
	@Query(value="SELECT date,list,user_id FROM user_list WHERE shopper_id = 1", nativeQuery=true)
	List<String[]> getJoshsFullOrders();
	
	@Query(value="SELECT * FROM user_list WHERE date=:date AND user_id=:userId AND shopper_id=:shopperId", nativeQuery=true)
	UserList getOrderList(@Param("date")String date, @Param("userId")Long userId, @Param("shopperId")int shopperId);
	
	@Query(value="SELECT date FROM user_list WHERE is_active='true' AND user_id=:id", nativeQuery=true)
	String getCurrentList(@Param("id")Long id);
	
	
}
