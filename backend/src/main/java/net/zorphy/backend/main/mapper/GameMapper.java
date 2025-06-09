package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.dto.response.GameDetails;
import net.zorphy.backend.main.entity.Game;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class GameMapper {
    public abstract GameDetails gameToGameDetails(Game game);

    public abstract Game gameDetailsToGame(GameDetails gameDetails);

}
