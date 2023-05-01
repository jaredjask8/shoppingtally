package com.app.shoppingtally.user;

public record RegistrationRequest(String password, String email, String firstname, String lastname, String role) {

}
