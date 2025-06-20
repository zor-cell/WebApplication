package net.zorphy.backend.main.repository;

import net.zorphy.backend.main.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserRepository extends CrudRepository<User, UUID> {
    User findByUsername(String username);
}
