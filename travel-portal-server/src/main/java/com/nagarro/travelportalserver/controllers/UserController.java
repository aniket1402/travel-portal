package com.nagarro.travelportalserver.controllers;

import com.nagarro.travelportalserver.constants.Constants;
import com.nagarro.travelportalserver.models.Contact;
import com.nagarro.travelportalserver.models.User;
import com.nagarro.travelportalserver.models.UserAuth;
import com.nagarro.travelportalserver.repositories.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

/**
 * @author aniketgupta01
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JavaMailSender sender;

	@PostMapping
	@RequestMapping(Constants.SIGNIN)
	public User authenticate(@RequestBody final UserAuth userAuth) {
		return userRepository.findByEmailAndPassword(userAuth.getUsername(), userAuth.getPassword());
	}

	@GetMapping
	@RequestMapping(value = Constants.SIGNUP_CONFIRM_ID, produces = MediaType.APPLICATION_JSON_VALUE)
	public User getUser(@PathVariable final Integer id) {
		return userRepository.getOne(id);
	}

	@RequestMapping(value = Constants.EDIT_USER_ID, method = RequestMethod.PUT)
	public User updateUser(@RequestBody final User user, @PathVariable final Integer id) {
		final User existingUser = userRepository.getOne(id);
		BeanUtils.copyProperties(user, existingUser, "id");
		return userRepository.saveAndFlush(existingUser);
	}

	@PostMapping
	@RequestMapping(Constants.FORGOT)
	public User forgotPassword(@RequestBody final String email) {
		final User user = userRepository.findByEmail(email);
		String mailText = Constants.HEY;
		final MimeMessage message = sender.createMimeMessage();
		final MimeMessageHelper helper = new MimeMessageHelper(message);
		if (user == null) {
			try {
				mailText += Constants.USER_NOT_FOUND;
				helper.setTo(email);
				helper.setText(mailText);
				helper.setSubject(Constants.NAGARRO_TRAVEL_PORTAL_INFORMATION);
			} catch (final MessagingException e) {
				e.printStackTrace();
				System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
			}
			sender.send(message);
			System.out.println(Constants.MAIL_SENT_SUCCESS);
			return null;
		}
		try {
			mailText += String.format(Constants.FORGOT_PASSWORD_MAIL, user.getFirstName(), user.getLastName(),
					user.getEmail(), user.getPassword());
			helper.setTo(email);
			helper.setText(mailText);
			helper.setSubject(Constants.NAGARRO_TRAVEL_PORTAL_INFORMATION);
		} catch (final MessagingException e) {
			e.printStackTrace();
			System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
		}
		sender.send(message);
		System.out.println(Constants.MAIL_SENT_SUCCESS);
		return user;
	}

	@PostMapping
	@RequestMapping(Constants.CONTACT)
	public void contact(@RequestBody final Contact contact) {

		final MimeMessage message = sender.createMimeMessage();
		final MimeMessageHelper helper = new MimeMessageHelper(message);
		try {
			final String mailText = contact.getMessage();
			helper.setTo(contact.getEmail());
			helper.setText(mailText);
			helper.setSubject(contact.getSubject());
		} catch (final MessagingException e) {
			e.printStackTrace();
			System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
		}
		sender.send(message);
		System.out.println(Constants.MAIL_SENT_SUCCESS);
	}

	@PostMapping
	@RequestMapping(Constants.SIGNUP)
	public User create(@RequestBody final User user) {
		final User user1 = userRepository.findByEmail(user.getEmail());
		if (user1 != null) {
			return null;
		}
		final String password = RandomStringUtils.random(8, true, true);
		user.setPassword(password);
		final MimeMessage message = sender.createMimeMessage();
		final MimeMessageHelper helper = new MimeMessageHelper(message);
		try {
			final String mailText = String.format(Constants.WELCOME_MAIL, user.getFirstName(), user.getLastName(),
					user.getEmail(), user.getPassword());
			helper.setTo(user.getEmail());
			helper.setText(mailText);
			helper.setSubject(Constants.NAGARRO_TRAVEL_PORTAL_INFORMATION);
		} catch (final MessagingException e) {
			e.printStackTrace();
			System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
		}
		sender.send(message);
		System.out.println(Constants.MAIL_SENT_SUCCESS);
		return userRepository.saveAndFlush(user);
	}
}
