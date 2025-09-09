package net.zorphy.backend.site.risk.service;

import net.zorphy.backend.site.risk.dto.DataEntry;
import net.zorphy.backend.site.risk.dto.SimulationConfig;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RiskServiceImpl implements RiskService{
    private final Random rand = new Random();

    @Override
    public Object simulate(SimulationConfig simulationConfig) {
        Map<Integer, DataEntry> map = new HashMap<>();

        for(int run = 1; run <= simulationConfig.runs(); run++) {
            int attackers = simulationConfig.attackers();
            int defenders = simulationConfig.defenders();
            while (attackers > 0 && defenders > 0) {
                int aDice = getDiceCount(attackers, true);
                int dDice = getDiceCount(attackers, false);

                List<Integer> aRolls = rollDice(aDice);
                List<Integer> dRolls = rollDice(dDice);

                int min = Math.min(aRolls.size(), dRolls.size());
                for (int i = 0; i < min; i++) {
                    int aRoll = aRolls.get(i);
                    int dRoll = dRolls.get(i);

                    if (aRoll > dRoll) {
                        defenders--;
                    } else {
                        attackers--;
                    }
                }
            }

            int result = attackers - defenders;

            if(!map.containsKey(result)) {
                map.put(result, new DataEntry(result, 1));
            } else {
                int count = map.get(result).count() + 1;
                map.put(result, new DataEntry(result, count));
            }
        }

        return listFromMap(map);
    }

    private int getDiceCount(int troops, boolean attacker) {
        if(!attacker) {
            if(troops >= 2) {
                return 2;
            } else if(troops == 1) {
                return 1;
            }
        } else {
            if(troops >= 3) return 3;
            else if(troops == 2) return 2;
            else if(troops == 1) return 1;
        }

        return 0;
    }

    private List<Integer> rollDice(int count) {
        List<Integer> dice = new ArrayList<>();
        for(int i = 0; i < count; i++) {
            int roll = rand.nextInt(6) + 1;
            dice.add(roll);
        }
        dice.sort(Collections.reverseOrder());
        return dice;
    }

    private static List<DataEntry> listFromMap(Map<Integer, DataEntry> map) {
        return map.values().stream()
                .toList();
    }
}
