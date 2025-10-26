package net.zorphy.backend.site.all.dto;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import net.zorphy.backend.main.dto.player.TeamDetails;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "@class"
)
public interface GameConfigBase {
    List<TeamDetails> teams();
}
