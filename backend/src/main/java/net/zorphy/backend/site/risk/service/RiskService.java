package net.zorphy.backend.site.risk.service;

import net.zorphy.backend.site.risk.dto.SimulationConfig;

public interface RiskService {
    Object simulate(SimulationConfig simulationConfig);
}
