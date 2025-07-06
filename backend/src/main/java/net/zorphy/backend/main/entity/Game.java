package net.zorphy.backend.main.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import net.zorphy.backend.main.dto.game.GameType;
import org.hibernate.annotations.Type;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate playedAt;

    private Duration duration;

    @Enumerated(EnumType.STRING)
    private GameType gameType;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Object gameState;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Object result;

    @ManyToMany
    @JoinTable(
            name = "game_player",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private Set<Player> players;

    public Game() {
    }

    public Game(LocalDate playedAt, GameType gameType, Object gameState, Object result, Set<Player> players) {
        this.playedAt = playedAt;
        this.gameType = gameType;
        this.gameState = gameState;
        this.result = result;
        this.players = players;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDate playedAt) {
        this.playedAt = playedAt;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public GameType getGameType() {
        return gameType;
    }

    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }

    public Object getGameState() {
        return gameState;
    }

    public void setGameState(Object gameState) {
        this.gameState = gameState;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    public Set<Player> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Player> players) {
        this.players = players;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Game game)) return false;
        return Objects.equals(id, game.id) && Objects.equals(playedAt, game.playedAt) && gameType == game.gameType && Objects.equals(gameState, game.gameState) && Objects.equals(result, game.result) && Objects.equals(players, game.players);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, playedAt, gameType, gameState, result, players);
    }
}
