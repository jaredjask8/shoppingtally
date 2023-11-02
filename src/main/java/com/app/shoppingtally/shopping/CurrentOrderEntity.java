package com.app.shoppingtally.shopping;

import java.io.Serializable;

import com.app.shoppingtally.user.Role;
import com.app.shoppingtally.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentOrderEntity implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	public Long id;
	
	@Column(columnDefinition="LONGTEXT")
	String todoList;
	@Column(columnDefinition="LONGTEXT")
	String produceList;
	@Column(columnDefinition="LONGTEXT")
	String beveragesList;
	@Column(columnDefinition="LONGTEXT")
	String breadList;
	@Column(columnDefinition="LONGTEXT")
	String internationalList;
	@Column(columnDefinition="LONGTEXT")
	String bakingList;
	@Column(columnDefinition="LONGTEXT")
	String pastaGrainsList;
	@Column(columnDefinition="LONGTEXT")
	String snacksList;
	@Column(columnDefinition="LONGTEXT")
	String petList;
	@Column(columnDefinition="LONGTEXT")
	String breakfastList;
	@Column(columnDefinition="LONGTEXT")
	String deliList;
	@Column(columnDefinition="LONGTEXT")
	String bakeryList;
	@Column(columnDefinition="LONGTEXT")
	String meatList;
	@Column(columnDefinition="LONGTEXT")
	String householdList;
	@Column(columnDefinition="LONGTEXT")
	String healthList;
	@Column(columnDefinition="LONGTEXT")
	String frozenList;
	@Column(columnDefinition="LONGTEXT")
	String dairyList;
	
	String customer_address;
	String customer_firstname;
	String customer_lastname;
	String date;
	String customer_email;
}
