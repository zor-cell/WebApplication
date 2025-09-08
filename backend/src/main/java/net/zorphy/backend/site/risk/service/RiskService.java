package net.zorphy.backend.site.risk.service;

import net.zorphy.backend.site.risk.dto.Settings;

public interface RiskService {
    Object simulate(Settings settings);
}
