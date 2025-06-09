package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.dto.response.PlayerDetails;
import net.zorphy.backend.main.entity.Player;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PlayerMapper {
    public abstract PlayerDetails playerToPlayerDetails(Player player);

    public abstract Player playerDetailsToPlayer(PlayerDetails playerDetails);
}
