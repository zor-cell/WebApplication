package net.zorphy.backend.main.repository;

import net.zorphy.backend.main.entity.Player;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;


public interface PlayerRepository extends CrudRepository<Player, UUID> {
    @Override
    @NonNull
    List<Player> findAll();

    Player findByName(String name);
}
