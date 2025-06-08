package net.zorphy.backend.catan.service;

import net.zorphy.backend.catan.dto.data.DicePair;
import net.zorphy.backend.catan.dto.data.DiceRoll;
import net.zorphy.backend.catan.dto.data.GameConfig;
import net.zorphy.backend.catan.dto.data.GameState;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class CatanServiceImpl implements CatanService {
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
        List<Character> eventCards = new ArrayList<>(Arrays.asList('e', 'e', 'e', 'y', 'b', 'g'));
        Collections.shuffle(eventCards);

        return eventCards;
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

        return new GameState(gameConfig, classicCards, eventCards, new ArrayList<>());
    }

    @Override
    public GameState rollDice(GameState oldState) {
        List<DicePair> classicCards = new ArrayList<>(oldState.classicCards());
        List<Character> eventCards = new ArrayList<>(oldState.eventCards());
        List<DiceRoll> diceRolls = new ArrayList<>(oldState.diceRolls());

        if(classicCards.isEmpty()) {
            classicCards = initClassicCards();
        }
        DicePair dicePair = classicCards.removeLast();

        if(eventCards.isEmpty()) {
            eventCards = initEventCards();
        }
        Character eventDice = eventCards.removeLast();

        DiceRoll diceRoll = new DiceRoll(dicePair, eventDice);
        diceRolls.add(diceRoll);

        return new GameState(
                oldState.gameConfig(),
                classicCards,
                eventCards,
                diceRolls
        );
    }
}
