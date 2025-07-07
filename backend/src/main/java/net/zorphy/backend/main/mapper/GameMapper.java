package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.component.FileUrlComponent;
import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.game.GameMetadata;
import net.zorphy.backend.main.entity.Game;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = FileUrlComponent.class)
public abstract class GameMapper {
    @Mapping(source = "imageUrl", target = "imageUrl", qualifiedByName = "resolveFileUrl")
    public abstract GameMetadata gameToGameMetadata(Game game);

    @Mapping(source = "game", target = "metadata")
    public abstract GameDetails gameToGameDetails(Game game);
}
