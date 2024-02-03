package com.app.shoppingtally.affiliate;

import org.springframework.data.mongodb.core.mapping.Document;

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
public class AffiliateAdminData {
	@Id
	String id;
	String name;
	String link;
	String image;
}
