package net.zorphy.backend.main.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import net.zorphy.backend.main.enums.GameType;
import org.hibernate.annotations.Type;

import java.util.Set;
import java.util.UUID;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private GameType gameType;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Object gameState;

    @ManyToOne
    private Player winner;

    @ManyToMany
    private Set<Player> players;
}
