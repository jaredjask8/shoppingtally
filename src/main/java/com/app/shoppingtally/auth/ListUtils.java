package com.app.shoppingtally.auth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import com.app.shoppingtally.auth.models.ListItemResponse;

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
}
