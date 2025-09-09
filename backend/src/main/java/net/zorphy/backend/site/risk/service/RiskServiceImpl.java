package net.zorphy.backend.site.risk.service;

import net.zorphy.backend.site.risk.dto.DataEntry;
import net.zorphy.backend.site.risk.dto.SimulationConfig;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RiskServiceImpl implements RiskService{
    private final Random rand = new Random();

    @Override
    public Object simulate(SimulationConfig simulationConfig) {
        Map<Integer, Integer> map = new HashMap<>();

        int[] aRolls = new int[3];
        int[] dRolls = new int[2];

        for(int run = 1; run <= simulationConfig.runs(); run++) {
            int attackers = simulationConfig.attackers();
            int defenders = simulationConfig.defenders();
            while (attackers > 0 && defenders > 0) {
                int aDice = getDiceCount(attackers, true);
                int dDice = getDiceCount(defenders, false);

                rollDice(aRolls, aDice);
                rollDice(dRolls, dDice);

                int min = Math.min(aDice, dDice);
                for (int i = 1; i <= min; i++) {
                    int aRoll = aRolls[aDice - i];
                    int dRoll = dRolls[dDice - i];
                    if(aRoll > dRoll) {
                        defenders--;
                    } else {
                        attackers--;
                    }
                }
            }

            int result = attackers - defenders;

            map.compute(result, (k, v) -> v == null ? 1 : v + 1);
        }

        //wrap data
        Map<Integer, DataEntry> data = map.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> new DataEntry(e.getKey(), e.getValue())
                ));

        return listFromMap(data);
    }

    private int getDiceCount(int troops, boolean attacker) {
        return attacker ? Math.min(3, troops) : Math.min(2, troops);
    }

    private void rollDice(int[] dice, int count) {
        for(int i = 0; i < count; i++) {
            int roll = rand.nextInt(6) + 1;
            dice[i] = roll;
        }

        Arrays.sort(dice, 0, count);
    }

    private static List<DataEntry> listFromMap(Map<Integer, DataEntry> map) {
        return map.values().stream()
                .toList();
    }
}
