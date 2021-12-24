package com.nagarro.travelportalserver.controllers;

import com.nagarro.travelportalserver.constants.Constants;
import com.nagarro.travelportalserver.models.Comment;
import com.nagarro.travelportalserver.models.Ticket;
import com.nagarro.travelportalserver.repositories.CommentRepository;
import com.nagarro.travelportalserver.repositories.TicketRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.List;

/**
 * @author aniketgupta01
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1")
public class TicketController {

	@Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JavaMailSender sender;

    @GetMapping
    @RequestMapping(value = Constants.REQUEST_TICKET_CONFIRM_ID, produces = MediaType.APPLICATION_JSON_VALUE)
    public Ticket get(@PathVariable final Integer id) {
        return ticketRepository.getOne(id);
    }

    @GetMapping
    @RequestMapping(value = Constants.MY_TICKETS_ID, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Ticket> getTicketsByUserId(@PathVariable final Integer id) {
        return ticketRepository.findByUserId(id);
    }

    @GetMapping
    @RequestMapping(value = Constants.GET_COMMENTS_ID, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Comment> getComments(@PathVariable final Integer id) {
        return commentRepository.findByTicketId(id);
    }

    @RequestMapping(value = Constants.REQUEST_TICKET_EDIT_ID, method = RequestMethod.PUT)
    public Ticket updateTicket(@RequestBody final Ticket ticket, @PathVariable final Integer id) {
        final Ticket existingTicket = ticketRepository.getOne(id);
        BeanUtils.copyProperties(ticket, existingTicket, Constants.ID2);
        final String name = ticket.getUser().getFirstName() + " " + ticket.getUser().getLastName();
        final MimeMessage message = sender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            final String mailText = String.format(Constants.TICKET_EDIT, name);
            helper.setTo(ticket.getUser().getEmail());
            helper.setText(mailText);
            helper.setSubject(Constants.TICKET_UPDATED);
        } catch (final MessagingException e) {
            e.printStackTrace();
            System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
        }
        sender.send(message);
        System.out.println(Constants.MAIL_SENT_SUCCESS);
        return ticketRepository.saveAndFlush(existingTicket);
    }

    @PostMapping
    @RequestMapping(Constants.REQUEST_TICKET)
    public Ticket requestTicket(@RequestBody final Ticket ticket) {
        final String name = ticket.getUser().getFirstName() + " " + ticket.getUser().getLastName();
        final MimeMessage message = sender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            final String mailText = String.format(Constants.TICKET_REQUESTED, name);
            helper.setTo(ticket.getUser().getEmail());
            helper.setText(mailText);
            helper.setSubject(Constants.TICKET_SUBMITTED);
        } catch (final MessagingException e) {
            e.printStackTrace();
            System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
        }
        sender.send(message);
        System.out.println(Constants.MAIL_SENT_SUCCESS);
        return ticketRepository.saveAndFlush(ticket);
    }
}
