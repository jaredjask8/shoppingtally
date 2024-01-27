package com.app.shoppingtally.affiliate;

import org.springframework.data.mongodb.core.mapping.Document;

import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "affiliateData")
public class AffiliateData {
	@Id
	String id;
	String name;
	String link;
	String image;
}
