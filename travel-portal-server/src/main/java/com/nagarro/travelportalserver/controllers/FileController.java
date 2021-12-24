package com.nagarro.travelportalserver.controllers;

import com.nagarro.travelportalserver.constants.Constants;
import com.nagarro.travelportalserver.models.File;
import com.nagarro.travelportalserver.models.Ticket;
import com.nagarro.travelportalserver.repositories.FileRepository;
import com.nagarro.travelportalserver.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * @author aniketgupta01
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1")
public class FileController {

	@Autowired
    private FileRepository fileRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private JavaMailSender sender;

    @PostMapping(Constants.ADMIN_UPLOAD_FILE_TICKET_ID)
    public File uploadFile(@PathVariable final Integer ticketId, @RequestParam final MultipartFile file) throws IOException {
        if(!ticketRepository.findById(ticketId).isPresent()) {
            throw new FileNotFoundException();
        }
        final String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        final String uploadedBy = Constants.ADMIN1;
        final File f = new File(fileName,
                        file.getContentType(),
                        file.getBytes(),
                        ticketId,
                        uploadedBy);
        final Ticket ticket = ticketRepository.getOne(ticketId);
        final String name = ticket.getUser().getFirstName() + " " + ticket.getUser().getLastName();
        final MimeMessage message = sender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            final String mailText = String.format(Constants.UPDATE_TICKET_FILE_UPLOAD, name);
            helper.setTo(ticket.getUser().getEmail());
            helper.setText(mailText);
            helper.setSubject(Constants.TICKET_UPDATE);
        } catch (final MessagingException e) {
            e.printStackTrace();
            System.out.println(Constants.ERROR_WHILE_SENDING_MAIL);
        }
        sender.send(message);
        System.out.println(Constants.MAIL_SENT_SUCCESS);
        fileRepository.save(f);
        return f;
    }

    @PostMapping(Constants.EMPLOYEE_UPLOAD_FILE_TICKET_ID)
    public File uploadEmpFile(@PathVariable final Integer ticketId, @RequestParam final MultipartFile file) throws IOException {
        if(!ticketRepository.findById(ticketId).isPresent()) {
            throw new FileNotFoundException();
        }
        final String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        final String uploadedBy = Constants.EMPLOYEE;
        final File f = new File(fileName,
                file.getContentType(),
                file.getBytes(),
                ticketId,
                uploadedBy);
        fileRepository.save(f);
        return f;
    }

    @GetMapping(Constants.ADMIN_GET_FILES_TICKET_ID)
    public List<File> getFilesByAdmin(@PathVariable final Integer ticketId) throws IOException {
        if(!ticketRepository.findById(ticketId).isPresent()) {
            throw new FileNotFoundException();
        }
        return fileRepository.findByTicketIdAndUploadedBy(ticketId, Constants.ADMIN1);
    }

    @GetMapping(Constants.EMPLOYEE_GET_FILES_TICKET_ID)
    public List<File> getFilesByEmployee(@PathVariable final Integer ticketId) throws IOException {
        if(!ticketRepository.findById(ticketId).isPresent()) {
            throw new FileNotFoundException();
        }
        return fileRepository.findByTicketIdAndUploadedBy(ticketId, Constants.EMPLOYEE);
    }

    @RequestMapping(value = Constants.DELETE_FILE_FILE_ID, method = RequestMethod.DELETE)
    public void deleteFile(@PathVariable final Integer fileId) {
        fileRepository.deleteById(fileId);
    }

    @GetMapping(Constants.GET_FILE_TICKET_ID_FILE_ID)
    public Optional<File> getFile(@PathVariable final Integer ticketId, @PathVariable final Integer fileId) throws IOException {
        if(!ticketRepository.findById(ticketId).isPresent()) {
            throw new FileNotFoundException();
        }
        return fileRepository.findById(fileId);
    }
}
