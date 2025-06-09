package net.zorphy.backend.main.repository;

import net.zorphy.backend.main.entity.Game;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface GameRepository extends CrudRepository<Game, UUID> {

}
