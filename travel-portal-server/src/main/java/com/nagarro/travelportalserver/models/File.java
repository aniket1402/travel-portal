package com.nagarro.travelportalserver.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

/**
 * @author aniketgupta01
 *
 */
@Entity(name = "files")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "ticket_id")
    private Integer ticketId;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Lob
    @Column(name = "file_byte", length = 16777215)
    private byte[] fileByte;

    public File() {}

    public File(final String name, final String type, final byte[] fileByte, final int ticketId, final String uploadedBy) {
        this.name = name;
        this.type = type;
        this.fileByte = fileByte;
        this.ticketId = ticketId;
        this.uploadedBy = uploadedBy;
    }

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(final String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public void setTicketId(final Integer ticketId) {
        this.ticketId = ticketId;
    }

    public byte[] getFileByte() {
        return fileByte;
    }

    public void setFileByte(final byte[] fileByte) {
        this.fileByte = fileByte;
    }
}
