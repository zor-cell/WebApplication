package net.zorphy.backend.project.catan.service;

import net.zorphy.backend.main.dto.game.GameDetails;
import net.zorphy.backend.main.dto.player.PlayerDetails;
import net.zorphy.backend.main.dto.player.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.entity.Player;
import net.zorphy.backend.main.dto.game.GameType;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.repository.GameRepository;
import net.zorphy.backend.main.repository.PlayerRepository;
import net.zorphy.backend.project.catan.dto.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CatanServiceImpl implements CatanService {
    private final List<Character> possibleEvents = new ArrayList<>(Arrays.asList('e', 'e', 'e', 'y', 'b', 'g'));
    private final Random rand = new Random();
    private final GameMapper gameMapper;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    public CatanServiceImpl(GameMapper gameMapper, GameRepository gameRepository, PlayerRepository playerRepository) {
        this.gameMapper = gameMapper;
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
    }

    private List<DicePair> initClassicCards() {
        List<DicePair> classicCards = new ArrayList<>(Arrays.asList(
                new DicePair(1, 1, "Each player receives 1 resource of their choice"),

                new DicePair(1, 2, "The player with the most knight cards or the “Largest Army” may steal a card from another player"),
                new DicePair(2, 1, "No Event"),

                new DicePair(1, 3, "The robber is moved back to the desert"),
                new DicePair(2, 2, "The robber is moved back to the desert"),
                new DicePair(3, 1, "No Event"),

                new DicePair(1, 4, "The player with the “Longest Road” may steal a resource from another player"),
                new DicePair(2, 3, "The player with the most knight cards receives 1 resource of their choice"),
                new DicePair(3, 2, "No Event"),
                new DicePair(4, 1, "No Event"),

                new DicePair(1, 5, "Each player gives one resource to their left-hand neighbor"),
                new DicePair(2, 4, "An earthquake destroys one road of each player, which must be repaired at normal road-building cost before new roads can be built"),
                new DicePair(3, 3, "Players receive only 1 resource per city"),
                new DicePair(4, 2, "No Event"),
                new DicePair(5, 1, "No Event"),

                new DicePair(1, 6, "Robber"),
                new DicePair(2, 5, "Robber"),
                new DicePair(3, 4, "Robber"),
                new DicePair(4, 3, "Robber"),
                new DicePair(5, 2, "Robber"),
                new DicePair(6, 1, "Robber"),

                new DicePair(2, 6, "Players receive only 1 resource per city"),
                new DicePair(3, 5, "No Event"),
                new DicePair(4, 4, "No Event"),
                new DicePair(5, 3, "No Event"),
                new DicePair(6, 2, "No Event"),

                new DicePair(3, 6, "Players with the most harbors receive 1 resource of their choice"),
                new DicePair(4, 5, "No Event"),
                new DicePair(5, 4, "No Event"),
                new DicePair(6, 3, "No Event"),

                new DicePair(4, 6, "The player(s) with the most victory points must give one resource to another player"),
                new DicePair(5, 5, "No Event"),
                new DicePair(6, 4, "No Event"),

                new DicePair(5, 6, "The player(s) with the most victory points must give one resource to another player"),
                new DicePair(6, 5, "No Event"),

                new DicePair(6, 6, "Players with the most harbors receive 1 resource of their choice")
        ));

        Collections.shuffle(classicCards);
        return classicCards;
    }

    private List<Character> initEventCards() {
        List<Character> shuffled = new ArrayList<>(possibleEvents);
        Collections.shuffle(shuffled);
        return shuffled;
    }

    @Override
    public GameState initGameState(GameConfig gameConfig) {
        //shuffle balanced classic dice deck
        List<DicePair> classicCards = null;
        if (gameConfig.classicDice().isBalanced()) {
            classicCards = initClassicCards();
        }

        //shuffle balance event cards
        List<Character> eventCards = null;
        if (gameConfig.gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (gameConfig.eventDice().isBalanced()) {
                eventCards = initEventCards();
            }
        }

        return new GameState(
                LocalDateTime.now(),
                gameConfig,
                0,
                0,
                classicCards,
                eventCards,
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateGameState(GameState oldState, GameConfig gameConfig) {
        //update turns if players changed
        int currentPlayerTurn = oldState.currentPlayerTurn() % gameConfig.teams().size();
        int currentShipTurn = oldState.currentShipTurn() % gameConfig.maxShipTurns();

        //update classic cards
        List<DicePair> classicCards = null;
        if (gameConfig.classicDice().isBalanced()) {
            if (oldState.gameConfig().classicDice().isBalanced()) {
                //reuse cards from old config if still balanced
                classicCards = oldState.classicCards();
            } else {
                //shuffle cards if changing to balanced
                classicCards = initClassicCards();
            }
        }

        //update event cards
        List<Character> eventCards = null;
        if (gameConfig.gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (gameConfig.eventDice().isBalanced()) {
                if (oldState.gameConfig().eventDice().isBalanced()) {
                    eventCards = oldState.eventCards();
                } else {
                    eventCards = initEventCards();
                }
            }
        }

        return new GameState(
                oldState.startTime(),
                gameConfig,
                currentPlayerTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                oldState.diceRolls()
        );
    }

    @Override
    public GameState rollDice(GameState oldState, boolean isAlchemist) {
        int currentTeamTurn = oldState.currentPlayerTurn();
        int currentShipTurn = oldState.currentShipTurn();
        List<DicePair> classicCards = oldState.classicCards() == null ? null : new ArrayList<>(oldState.classicCards());
        List<Character> eventCards = oldState.eventCards() == null ? null : new ArrayList<>(oldState.eventCards());
        List<DiceRoll> diceRolls = new ArrayList<>(oldState.diceRolls());

        TeamDetails currentTeam = oldState.gameConfig().teams().get(currentTeamTurn);

        //classic dice roll
        DicePair dicePair;
        if (isAlchemist) {
            //alchemist roll
            dicePair = new DicePair(0, 0, null);
        } else {
            //normal roll
            if (classicCards == null || !oldState.gameConfig().classicDice().isBalanced()) {
                int dice1 = rand.nextInt(6) + 1;
                int dice2 = rand.nextInt(6) + 1;
                dicePair = new DicePair(dice1, dice2, null);
            } else {
                if (classicCards.size() <= oldState.gameConfig().classicDice().shuffleThreshold()) {
                    classicCards = initClassicCards();
                }
                dicePair = classicCards.removeLast();
            }
        }

        //event dice roll
        Character eventDice = null;
        if (oldState.gameConfig().gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (eventCards == null || !oldState.gameConfig().eventDice().isBalanced()) {
                int eventIndex = rand.nextInt(possibleEvents.size());
                eventDice = possibleEvents.get(eventIndex);
            } else {
                if (eventCards.size() <= oldState.gameConfig().eventDice().shuffleThreshold()) {
                    eventCards = initEventCards();
                }
                eventDice = eventCards.removeLast();
            }

            //reset ship to start if charge happened last round
            if (currentShipTurn >= oldState.gameConfig().maxShipTurns() - 1) {
                currentShipTurn = 0;
            }

            //update ship
            if (eventDice.equals('e')) {
                currentShipTurn = (currentShipTurn + 1) % oldState.gameConfig().maxShipTurns();
            }
        }

        DiceRoll diceRoll = new DiceRoll(dicePair, eventDice, currentTeam.name());

        //don't allow 2 same dice rolls after another
        if (oldState.gameConfig().gameMode() == GameMode.ONE_VS_ONE) {
            if (!diceRolls.isEmpty()) {
                DiceRoll lastRoll = diceRolls.getLast();
                if (lastRoll.teamName().equals(currentTeam.name()) && lastRoll.dicePair().sum() == diceRoll.dicePair().sum()) {
                    //if all cards are the same, no choice but to have two in row
                    boolean allSame = classicCards != null && classicCards.stream().allMatch(pair -> pair.sum() == diceRoll.dicePair().sum());

                    //add card back on the bottom of the card deck
                    if (classicCards != null) {
                        classicCards.addFirst(dicePair);
                    }

                    //try to roll again with reshuffled deck
                    if (!allSame) {
                        return rollDice(new GameState(
                                oldState.startTime(),
                                oldState.gameConfig(),
                                oldState.currentPlayerTurn(),
                                oldState.currentShipTurn(),
                                classicCards,
                                oldState.eventCards(),
                                oldState.diceRolls()
                        ), isAlchemist);
                    }
                }
            }
        }

        //update team
        if (oldState.gameConfig().gameMode() == GameMode.ONE_VS_ONE) {
            //only update to next team if team also rolled last roll
            if (!diceRolls.isEmpty()) {
                DiceRoll lastRoll = diceRolls.getLast();
                if (lastRoll.teamName().equals(currentTeam.name())) {
                    currentTeamTurn = (currentTeamTurn + 1) % oldState.gameConfig().teams().size();
                }
            }
        } else {
            currentTeamTurn = (currentTeamTurn + 1) % oldState.gameConfig().teams().size();
        }

        diceRolls.add(diceRoll);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                currentTeamTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                diceRolls
        );
    }

    @Override
    public GameDetails saveGame(GameState gameState, SaveGameState saveGameState) {
        //get all players in team from db
        Set<Player> players = gameState.gameConfig().teams().stream()
                .flatMap(team -> team.players().stream())
                .map(PlayerDetails::name)
                .map(playerRepository::findByName)
                .collect(Collectors.toSet());

        Game toSave = new Game(
                LocalDateTime.now(),
                Duration.between(gameState.startTime(), LocalDateTime.now()),
                GameType.CATAN,
                gameState,
                saveGameState,
                players
        );
        Game saved = gameRepository.save(toSave);
        return gameMapper.gameToGameDetails(saved);
    }
}
