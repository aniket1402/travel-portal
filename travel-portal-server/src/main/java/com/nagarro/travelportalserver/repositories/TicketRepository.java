package com.nagarro.travelportalserver.repositories;

import com.nagarro.travelportalserver.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author aniketgupta01
 *
 */
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByUserId(Integer id);
}
