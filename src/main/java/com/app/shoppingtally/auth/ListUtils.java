package com.app.shoppingtally.auth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.app.shoppingtally.affiliate.AffiliateData;
import com.app.shoppingtally.auth.models.ListItemResponse;

@Service
public final class ListUtils {
	public List<ListItemResponse> convertStringListToArray(String list){
		if( list != null) {
			List<ListItemResponse> listArray = new ArrayList<ListItemResponse>();
			var tempArray = list.split("~");
			
			Stream<String> arr_stream = Arrays.stream(tempArray);
			arr_stream.forEach((d) -> {
				
				if(d != "") {
					var splitByCategory = d.split("\\+");
					var image = splitByCategory[0];
					var name = splitByCategory[1];
					var quantity = splitByCategory[2];
					listArray.add(new ListItemResponse(image,name,quantity));
				}
				
				
			});
			
			return listArray;
		}else {
			return new ArrayList<ListItemResponse>();
		}
		
		
	}
	
	public List<AffiliateData> convertAffiliateStringToArray(String affiliateData){
		if( affiliateData != null) {
			List<AffiliateData> affiliateArray = new ArrayList<AffiliateData>();
			var tempArray = affiliateData.split("~");
			
			Stream<String> arr_stream = Arrays.stream(tempArray);
			arr_stream.forEach((d) -> {
				
				if(d != "") {
					var splitByCategory = d.split("\\+");
					var name = splitByCategory[0];
					var image = splitByCategory[1];
					var link = splitByCategory[2];
					affiliateArray.add(new AffiliateData(name,link,image));
				}
				
				
			});
			
			return affiliateArray;
		}else {
			return new ArrayList<AffiliateData>();
		}
	}
}
