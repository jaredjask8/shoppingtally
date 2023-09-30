package com.app.shoppingtally.admin.whatsNew;

import java.sql.Blob;

import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsNew {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	String title;
	String description;
	
	@Lob
	@Column(columnDefinition="LONGTEXT")
	String imageData;
}
