package com.app.shoppingtally.date;

import java.io.Serializable;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.app.shoppingtally.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="dates_available")
public class Date implements Serializable{
	@Id
	@GeneratedValue(strategy=GenerationType.TABLE)
	@Column(name="id", updatable = false, nullable = false)
	private Long id;
	
	private String email;
	private Long fid;
	private int year;
	private int month;
	private int day;
}
