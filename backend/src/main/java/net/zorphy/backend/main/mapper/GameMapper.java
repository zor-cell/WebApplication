package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.dto.GameDetails;
import net.zorphy.backend.main.entity.Game;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class GameMapper {
    public abstract GameDetails gameToGameDetails(Game game);

    @Mapping(target = "gameState", source = "gameState")
    public abstract Game gameDetailsToGame(GameDetails gameDetails, Object gameState);

}
