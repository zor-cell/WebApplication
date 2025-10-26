package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.component.FileUrlComponent;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.site.all.dto.GameStateBase;
import net.zorphy.backend.site.all.service.GameSpecificMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = FileUrlComponent.class)
public abstract class GameMapper {
    @Autowired
    private List<GameSpecificMapper> gameMapperList;

    @Named("mapGameState")
    protected GameStateBase mapGameState(Game game) {
        GameSpecificMapper gameMapper = gameMapperList.stream()
                .filter(m -> m.supportedType().equals(GameType.valueOf(game.getGameType())))
                .findFirst()
                .orElse(null);
        if(gameMapper != null) {
            return gameMapper.mapGameState(game.getGameState());
        }

        return game.getGameState();
    }

    @Mapping(source = "imageUrl", target = "imageUrl", qualifiedByName = "resolveFileUrl")
    public abstract GameMetadata gameToGameMetadata(Game game);

    @Mapping(source = "game", target = "metadata")
    @Mapping(target = "gameState", expression = "java(mapGameState(game))")
    public abstract GameDetails gameToGameDetails(Game game);
}