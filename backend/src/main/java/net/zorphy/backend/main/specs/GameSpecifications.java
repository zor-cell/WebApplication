package net.zorphy.backend.main.specs;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.entity.Game;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GameSpecifications {
    public static Specification<Game> search(GameFilters gameFilters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            //playedAt
            Path<LocalDateTime> playedAt = root.get("playedAt");
            Predicate playedAtPredicate = null;
            if(gameFilters.dateFrom() != null && gameFilters.dateTo() != null) {
                //from - to
                playedAtPredicate = cb.between(playedAt, gameFilters.dateFrom(), gameFilters.dateTo());
            } else if(gameFilters.dateFrom() != null) {
                //from -
                playedAtPredicate = cb.greaterThanOrEqualTo(playedAt, gameFilters.dateFrom());
            } else if(gameFilters.dateTo() != null) {
                // - to
                playedAtPredicate = cb.lessThanOrEqualTo(playedAt, gameFilters.dateTo());
            }
            if(playedAtPredicate != null) {
                predicates.add(playedAtPredicate);
            }

            //duration
            Path<LocalDateTime> duration = root.get("duration");
            Predicate durationPredicate = null;
            if(gameFilters.minDuration() != null && gameFilters.maxDuration() != null) {
                //from - to
                durationPredicate = cb.between(duration, gameFilters.dateFrom(), gameFilters.dateTo());
            } else if(gameFilters.minDuration() != null) {
                //from -
                durationPredicate = cb.greaterThanOrEqualTo(duration, gameFilters.dateFrom());
            } else if(gameFilters.maxDuration() != null) {
                // - to
                durationPredicate = cb.lessThanOrEqualTo(duration, gameFilters.dateTo());
            }
            if(durationPredicate != null) {
                predicates.add(durationPredicate);
            }

            if(gameFilters.gameType() != null) {
                var p = cb.like(cb.lower(root.get("gameType")).as(String.class), "%" + gameFilters.gameType().toLowerCase() + "%");
                predicates.add(p);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
