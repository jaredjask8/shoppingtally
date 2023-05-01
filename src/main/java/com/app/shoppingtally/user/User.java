package com.app.shoppingtally.user;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class User{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	private String password;
	private String email;
	private String firstname;
	private String lastname;
	private String role;
	private boolean isEnabled = false;
	
	
}
