package com.app.shoppingtally.list;

import java.util.Date;
import java.util.List;

import com.app.shoppingtally.auth.models.ListItemResponse;

public record ListDTO(List<ListItemResponse> list, String date) {

}
