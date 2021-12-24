package com.nagarro.travelportalserver.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Date;

/**
 * @author aniketgupta01
 *
 */
@Entity(name = "tickets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "request_type")
    private String requestType;

    @Column(name = "priority")
    private String priority;

    @Column(name = "travel_city")
    private String travelCity;

    @Column(name = "location_city")
    private String locationCity;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "expense_borne_by")
    private String expenseBorneBy;

    @Column(name = "travel_approver_name")
    private String travelApproverName;

    @Column(name = "expected_duration")
    private String expectedDuration;

    @Column(name = "upper_bound_on_amt")
    private String upperBoundOnAmt;

    @Column(name = "additional_details")
    private String additionalDetails;

    @Column(name = "status")
    private String status;

    @Column(name = "submitted_date")
    private Date submittedDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public Ticket() {}

    public User getUser() {
        return user;
    }

    public void setUser(final User user) {
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(final Integer id) {
        this.id = id;
    }

    public Date getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(final Date submittedDate) {
        this.submittedDate = submittedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(final String requestType) {
        this.requestType = requestType;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(final String priority) {
        this.priority = priority;
    }

    public String getTravelCity() {
        return travelCity;
    }

    public void setTravelCity(final String travelCity) {
        this.travelCity = travelCity;
    }

    public String getLocationCity() {
        return locationCity;
    }

    public void setLocationCity(final String locationCity) {
        this.locationCity = locationCity;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(final Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(final Date endDate) {
        this.endDate = endDate;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(final String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(final String projectName) {
        this.projectName = projectName;
    }

    public String getExpenseBorneBy() {
        return expenseBorneBy;
    }

    public void setExpenseBorneBy(final String expenseBorneBy) {
        this.expenseBorneBy = expenseBorneBy;
    }

    public String getTravelApproverName() {
        return travelApproverName;
    }

    public void setTravelApproverName(final String travelApproverName) {
        this.travelApproverName = travelApproverName;
    }

    public String getExpectedDuration() {
        return expectedDuration;
    }

    public void setExpectedDuration(final String expectedDuration) {
        this.expectedDuration = expectedDuration;
    }

    public String getUpperBoundOnAmt() {
        return upperBoundOnAmt;
    }

    public void setUpperBoundOnAmt(final String upperBoundOnAmt) {
        this.upperBoundOnAmt = upperBoundOnAmt;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(final String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }
}
