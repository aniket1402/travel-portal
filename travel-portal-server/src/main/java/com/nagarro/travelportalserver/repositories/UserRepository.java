package com.nagarro.travelportalserver.repositories;

import com.nagarro.travelportalserver.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author aniketgupta01
 *
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);

    User findByEmailAndPassword(String username, String password);
}
