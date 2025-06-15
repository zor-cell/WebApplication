package net.zorphy.backend.catan.service;

import net.zorphy.backend.catan.dto.DicePair;
import net.zorphy.backend.catan.dto.DiceRoll;
import net.zorphy.backend.catan.dto.GameConfig;
import net.zorphy.backend.catan.dto.GameState;
import net.zorphy.backend.main.dto.GameDetails;
import net.zorphy.backend.main.dto.PlayerDetails;
import net.zorphy.backend.main.dto.TeamDetails;
import net.zorphy.backend.main.entity.Game;
import net.zorphy.backend.main.entity.Player;
import net.zorphy.backend.main.enums.GameType;
import net.zorphy.backend.main.mapper.GameMapper;
import net.zorphy.backend.main.mapper.PlayerMapper;
import net.zorphy.backend.main.repository.GameRepository;
import net.zorphy.backend.main.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        List<DicePair> classicCards = new ArrayList<>();

        for(int dice1 = 1;dice1 <= 6;dice1++) {
            for(int dice2 = 1;dice2 <= 6;dice2++) {
                DicePair dicePair = new DicePair(dice1, dice2);
                classicCards.add(dicePair);
            }
        }

        Collections.shuffle(classicCards);
        return classicCards;
    }

    private List<Character> initEventCards() {
        List<Character> shuffled = new ArrayList<>(possibleEvents);
        Collections.shuffle(shuffled);
        return shuffled;
    }

    @Override
    public GameState getGameStateFromConfig(GameConfig gameConfig) {
        //shuffle balanced classic dice deck
        List<DicePair> classicCards = null;
        if(gameConfig.classicDice().isBalanced()) {
            classicCards = initClassicCards();
        }

        //shuffle balance event cards
        List<Character> eventCards = null;
        if(gameConfig.eventDice().isBalanced()) {
            eventCards = initEventCards();
        }

        return new GameState(gameConfig, 0, 0, classicCards, eventCards, new ArrayList<>());
    }

    @Override
    public GameState rollDice(GameState oldState, boolean isAlchemist) {
        int currentPlayerTurn = oldState.currentPlayerTurn();
        int currentShipTurn = oldState.currentShipTurn();
        List<DicePair> classicCards = oldState.classicCards() == null ? null : new ArrayList<>(oldState.classicCards());
        List<Character> eventCards = oldState.eventCards() == null ? null : new ArrayList<>(oldState.eventCards());
        List<DiceRoll> diceRolls = new ArrayList<>(oldState.diceRolls());

        //classic dice roll
        DicePair dicePair;
        if(isAlchemist) {
            //alchemist roll
            dicePair = new DicePair(0, 0);
        } else {
            //normal roll
            if (classicCards == null) {
                int dice1 = rand.nextInt(6) + 1;
                int dice2 = rand.nextInt(6) + 1;
                dicePair = new DicePair(dice1, dice2);
            } else {
                if (classicCards.size() <= oldState.gameConfig().classicDice().shuffleThreshold()) {
                    classicCards = initClassicCards();
                }
                dicePair = classicCards.removeLast();
            }
        }

        //event dice roll
        Character eventDice;
        if (eventCards == null) {
            int eventIndex = rand.nextInt(possibleEvents.size());
            eventDice = possibleEvents.get(eventIndex);
        } else {
            if (eventCards.size() <= oldState.gameConfig().eventDice().shuffleThreshold()) {
                eventCards = initEventCards();
            }
            eventDice = eventCards.removeLast();
        }

        //update player
        currentPlayerTurn = (currentPlayerTurn + 1) % oldState.gameConfig().teams().size();

        //reset ship to start if charge happened last round
        if(currentShipTurn == oldState.gameConfig().maxShipTurns() - 1) {
            currentShipTurn = 0;
        }

        //update ship
        if(eventDice.equals('e')) {
            currentShipTurn = (currentShipTurn + 1) % oldState.gameConfig().maxShipTurns();
        }

        DiceRoll diceRoll = new DiceRoll(dicePair, eventDice);
        diceRolls.add(diceRoll);

        return new GameState(
                oldState.gameConfig(),
                currentPlayerTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                diceRolls
        );
    }

    @Override
    public GameDetails saveGame(GameState gameState, String winnerTeamName) {
        //get all winner players
        Optional<TeamDetails> winnerTeam = gameState.gameConfig().teams().stream()
                .filter(team -> team.name().equals(winnerTeamName))
                .findFirst();
        if(winnerTeam.isEmpty()) {
            throw new IllegalArgumentException("Winner team name does not exist in teams");
        }
        Set<Player> winners = winnerTeam.get().players().stream()
                .map(PlayerDetails::name)
                .map(playerRepository::findByName)
                .collect(Collectors.toSet());

        //get all players in team from db
        Set<Player> players = gameState.gameConfig().teams().stream()
                .flatMap(team -> team.players().stream())
                .map(PlayerDetails::name)
                .map(playerRepository::findByName)
                .collect(Collectors.toSet());

        Game toSave = new Game(
            LocalDate.now(),
            GameType.CATAN,
            gameState,
            winners,
            players
        );
        Game saved = gameRepository.save(toSave);
        return gameMapper.gameToGameDetails(saved);
    }
}
