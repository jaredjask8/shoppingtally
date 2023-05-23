package com.app.shoppingtally.user;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserService;

import jakarta.persistence.Tuple;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/login")
public class UserController {
	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;

	}
	
	@GetMapping("/all")
	public ResponseEntity<List<User>> getUsers(){
		List<User> users = userService.getUsers();
		return new ResponseEntity<>(users,HttpStatus.OK);
	}

//	@PostMapping("/add")
//	public ResponseEntity<User> addUser(@RequestBody User user){
//		User newUser = userService.addUser(user);
//		return new ResponseEntity<>(newUser,HttpStatus.CREATED);
//	}
//	
//	@PutMapping("/update")
//	public ResponseEntity<User> updateUser(@RequestBody User user){
//		User updateUser = userService.updateEmployee(user);
//		return new ResponseEntity<>(updateUser,HttpStatus.OK);
//	}
//	
//	@DeleteMapping("/delete/{id}")
//	public ResponseEntity<?> deleteUser(@PathVariable("id") Long id){
//		userService.deleteUser(id);
//		return new ResponseEntity<>(HttpStatus.OK);
//	}
	
	@PostMapping("/authenticate")
	public ResponseEntity<User> authenticateUser(@RequestBody User user) {
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	@PostMapping("/register")
	public ResponseEntity<User> registerUser(@RequestBody User user) {
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
}
