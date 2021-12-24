package com.nagarro.travelportalserver.repositories;

import com.nagarro.travelportalserver.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author aniketgupta01
 *
 */
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByTicketId(Integer id);
}
