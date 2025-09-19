package net.zorphy.backend.main.specs;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import net.zorphy.backend.main.dto.game.GameFilters;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.entity.Game_;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class GameSpecifications {
    public static Specification<Game> search(GameFilters gameFilters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            //playedAt
            Path<Instant> playedAt = root.get(Game_.playedAt);
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

            //duration (is stored in seconds in db so compare seconds)
            Expression<Long> duration = root.get(Game_.duration).as(Long.class);
            Predicate durationPredicate = null;

            Long minSec = gameFilters.minDuration() != null ? gameFilters.minDuration().getSeconds() : null;
            Long maxSec = gameFilters.maxDuration() != null ? gameFilters.maxDuration().getSeconds() : null;
            if(gameFilters.minDuration() != null && gameFilters.maxDuration() != null) {
                //from - to
                durationPredicate = cb.between(duration, minSec, maxSec);
            } else if(gameFilters.minDuration() != null) {
                //from -
                durationPredicate = cb.greaterThanOrEqualTo(duration, minSec);
            } else if(gameFilters.maxDuration() != null) {
                // - to
                durationPredicate = cb.lessThanOrEqualTo(duration, maxSec);
            }
            if(durationPredicate != null) {
                predicates.add(durationPredicate);
            }

            //game type
            if(gameFilters.gameTypes() != null && !gameFilters.gameTypes().isEmpty()) {
                Path<String> gameType = root.get(Game_.gameType);
                Predicate all = cb.or();
                for(GameType filterGameType : gameFilters.gameTypes()) {
                    Predicate cur = cb.like(cb.lower(gameType), "%" + filterGameType.toString().toLowerCase() + "%");
                    all = cb.or(cur, all);
                }
                predicates.add(all);
            }

            //text
            if(gameFilters.text() != null && !gameFilters.text().isEmpty()) {
                //search game type
                Path<String> gameType = root.get(Game_.gameType);
                Predicate gameTypePredicate = cb.like(cb.lower(gameType), "%" + gameFilters.text().toLowerCase() + "%");

                //jsonb query to recursively check all properties values with regex
                String searchText = gameFilters.text().replace("\"", "\\\"");
                String jsonQuery = "$.** ? (@ like_regex \"" + searchText + "\" flag \"i\")";

                //search game state
                Predicate gameStatePredicate = cb.isTrue(cb.function(
                        "jsonb_path_exists",
                        Boolean.class,
                        root.get(Game_.gameState),
                        cb.literal(jsonQuery)
                ));

                //search result state
                Predicate resultStatePredicate = cb.isTrue(cb.function(
                        "jsonb_path_exists",
                        Boolean.class,
                        root.get(Game_.result),
                        cb.literal(jsonQuery)
                ));

                predicates.add(cb.or(
                        gameTypePredicate,
                        gameStatePredicate,
                        resultStatePredicate
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
