package com.app.shoppingtally.date;

import java.util.function.Function;

import org.springframework.stereotype.Service;

@Service
public class DateDTOMapper implements Function<Date, DateDTO>{

	@Override
	public DateDTO apply(Date date) {
		// TODO Auto-generated method stub
		return new DateDTO(date.getDay(), date.getMonth(), date.getYear());
	}

}
