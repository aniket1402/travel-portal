package com.nagarro.travelportalserver.repositories;

import com.nagarro.travelportalserver.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author aniketgupta01
 *
 */
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Admin findByUsernameAndPassword(String username, String password);
}
