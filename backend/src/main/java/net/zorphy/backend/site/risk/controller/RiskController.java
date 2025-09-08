package net.zorphy.backend.site.risk.controller;

import jakarta.validation.Valid;
import net.zorphy.backend.site.risk.dto.Settings;
import net.zorphy.backend.site.risk.service.RiskService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/risk")
public class RiskController {
    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping("simulation")
    public Object simulate(@RequestBody @Valid Settings settings) {
        return riskService.simulate(settings);
    }
}
