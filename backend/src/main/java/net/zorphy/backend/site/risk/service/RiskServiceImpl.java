package net.zorphy.backend.site.risk.service;

import net.zorphy.backend.site.risk.dto.MapEntry;
import net.zorphy.backend.site.risk.dto.Settings;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RiskServiceImpl implements RiskService{
    private final Random rand = new Random();

    @Override
    public Object simulate(Settings settings) {
        Map<Integer, MapEntry> map = new HashMap<>();

        for(int r = 1;r <= settings.runs();r++) {
            int attackers = settings.attackers();
            int defenders = settings.defenders();
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
                map.put(result, new MapEntry(result, 1));
            } else {
                int count = map.get(result).count() + 1;
                map.put(result, new MapEntry(result, count));
            }
        }

        return listFromMap(map);
    }

    private int getDiceCount(int troups, boolean attacker) {
        if(!attacker) {
            if(troups >= 2) {
                return 2;
            } else if(troups == 1) {
                return 1;
            }
        } else {
            if(troups >= 3) return 3;
            else if(troups == 2) return 2;
            else if(troups == 1) return 1;
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

    private static List<MapEntry> listFromMap(Map<Integer, MapEntry> map) {
        return map.values().stream()
                .toList();
    }
}
