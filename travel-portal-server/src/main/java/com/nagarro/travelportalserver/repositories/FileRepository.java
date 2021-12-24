package com.nagarro.travelportalserver.repositories;

import com.nagarro.travelportalserver.models.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author aniketgupta01
 *
 */
public interface FileRepository extends JpaRepository<File, Integer> {
    List<File> findByTicketId(Integer ticketId);

    List<File> findByTicketIdAndUploadedBy(Integer ticketId, String uploadedBy);
}
