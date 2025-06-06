package net.zorphy.backend.main.controller;

import net.zorphy.backend.main.dto.response.ProjectDetails;
import net.zorphy.backend.main.dto.response.ProjectMetadata;
import net.zorphy.backend.main.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import java.lang.invoke.MethodHandles;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProjectService projectService;
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping()
    public List<ProjectMetadata> getProjects() {
        LOGGER.info("GET /projects");

        return projectService.getProjects();
    }

    @GetMapping( "/{name}")
    public ProjectDetails getProject(@PathVariable String name) {
        LOGGER.info("GET /projects/" + name);

        return projectService.getProject(name);
    }
}
