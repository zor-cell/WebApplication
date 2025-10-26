package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.component.FileUrlComponent;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.service.game.GameSpecificMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = FileUrlComponent.class)
public abstract class GameMapper {
    @Autowired
    private List<GameSpecificMapper> gameMapperList;

    @Autowired
    private CustomObjectMapperComponent mapper;


    @Named("mapGameState")
    protected Object mapGameState(Game game) {
        GameSpecificMapper gameMapper = gameMapperList.stream()
                .filter(m -> m.supportedType().equals(GameType.valueOf(game.getGameType())))
                .findFirst()
                .orElse(null);
        if(gameMapper != null) {
            return gameMapper.mapGameState(game.getGameState());
        }

        Object gameState = game.getGameState();
        var a = gameState.getClass();
        return mapper.getMapper().convertValue(gameState, gameState.getClass());
    }

    @Mapping(source = "imageUrl", target = "imageUrl", qualifiedByName = "resolveFileUrl")
    public abstract GameMetadata gameToGameMetadata(Game game);

    @Mapping(source = "game", target = "metadata")
    @Mapping(target = "gameState", expression = "java(mapGameState(game))")
    public abstract GameDetails gameToGameDetails(Game game);
}