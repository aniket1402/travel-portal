package com.nagarro.travelportalserver.constants;

/**
 * @author aniketgupta01
 *
 */
public class Constants {

	public static final String ADMIN = "/admin";

	public static final String ADMIN_COMMENT = "/admin/comment";

	public static final String MAIL_SENT_SUCCESS = "Mail Sent Success!";

	public static final String ERROR_WHILE_SENDING_MAIL = "Error while sending mail ..";

	public static final String TICKET_UPDATE = "Ticket Update";

	public static final String APPROVED = "APPROVED";

	public static final String STRING = "";

	public static final String ID2 = "id";

	public static final String ADMIN_UPDATE_TICKET_ID = "/admin/update-ticket/{id}";

	public static final String ADMIN_GET_COMMENTS_ID = "/admin/getComments/{id}";

	public static final String ADMIN_HOME = "/admin/home";

	public static final String GET_FILE_TICKET_ID_FILE_ID = "/getFile/{ticketId}/{fileId}";

	public static final String DELETE_FILE_FILE_ID = "/deleteFile/{fileId}";

	public static final String EMPLOYEE_GET_FILES_TICKET_ID = "/employee/getFiles/{ticketId}";

	public static final String ADMIN_GET_FILES_TICKET_ID = "/admin/getFiles/{ticketId}";

	public static final String EMPLOYEE = "employee";

	public static final String EMPLOYEE_UPLOAD_FILE_TICKET_ID = "/employee/uploadFile/{ticketId}";

	public static final String ADMIN1 = "admin";

	public static final String ADMIN_UPLOAD_FILE_TICKET_ID = "/admin/uploadFile/{ticketId}";

	public static final String TICKET_SUBMITTED = "Ticket Submitted";

	public static final String REQUEST_TICKET = "/request-ticket";

	public static final String TICKET_UPDATED = "Ticket Updated";

	public static final String REQUEST_TICKET_EDIT_ID = "/request-ticket-edit/{id}";

	public static final String GET_COMMENTS_ID = "/getComments/{id}";

	public static final String MY_TICKETS_ID = "/my-tickets/{id}";

	public static final String REQUEST_TICKET_CONFIRM_ID = "/request-ticket-confirm/{id}";

	public static final String SIGNUP = "/signup";

	public static final String CONTACT = "/contact";

	public static final String NAGARRO_TRAVEL_PORTAL_INFORMATION = "Nagarro Travel Portal Information";

	public static final String HEY = "\nHey";

	public static final String FORGOT = "/forgot";

	public static final String EDIT_USER_ID = "/edit-user/{id}";

	public static final String SIGNUP_CONFIRM_ID = "/signup/confirm/{id}";

	public static final String SIGNIN = "/signin";

	public static final String UPDATE_TICKET_ADD_COMMENT = "Hi %s,\nWe have an update on your ticket.\n\n%s:\n%s"
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String UPDATE_TICKET_PROCESS = "Hi %s,\nYour ticket is in process state!."
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String UPDATE_TICKET_APPROVED = "Hi %s,\nYour ticket has been approved!."
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String UPDATE_TICKET_FILE_UPLOAD = "Hi %s,\nWe have an update on your ticket. We have uploaded"
			+ "file on your ticket." + "\nPlease contact the Travel team if you have any questions."
			+ "\n\nWarm regards,\nNagarro Travel Team";

	public static final String TICKET_REQUESTED = "Hi %s,\nYour ticket has been submitted successfully!."
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String TICKET_EDIT = "Hi %s,\nYour ticket has been successfully updated."
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String WELCOME_MAIL = "\nHey %s %s!\n\nWelcome to Nagarro "
			+ "Travel. We are happy to have you join our community.\n\nNagarro Travel goal is to provide "
			+ "tickets, hotel rooms, visa and work permit to Nagarro employees for their work-related travels.\n\n"
			+ "Account Details:\nUsername: %s\nPassword: %s\n\n"
			+ "We are constantly looking for ways to improve our services. If you have any feedback or suggestions"
			+ ", please use Contact Us form to write to us.\n\nWarm regards,\nNagarro Travel Team";

	public static final String FORGOT_PASSWORD_MAIL = " %s %s,\n\nYou have requested your user name "
			+ "and password for the your access to the Nagarro Travel Portal:\n\nUsername: %s\nPassword: %s\n\nPlease contact the Travel team if you "
			+ "have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

	public static final String USER_NOT_FOUND = ",\nEmail id not registered. SignUp using your email id."
			+ "\nPlease contact the Travel team if you have any questions." + "\n\nWarm regards,\nNagarro Travel Team";

}
