package net.zorphy.backend.main.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import net.zorphy.backend.main.dto.project.ProjectDetails;
import net.zorphy.backend.main.dto.project.ProjectMetadata;
import net.zorphy.backend.main.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    private String getBaseUrlFromRequest(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/api";
    }

    @GetMapping()
    public List<ProjectMetadata> getProjects(HttpServletRequest request) {
        return projectService.getProjects(getBaseUrlFromRequest(request));
    }

    @GetMapping("/{name}")
    public ProjectDetails getProject(@NotBlank @PathVariable String name, HttpServletRequest request) {
        return projectService.getProject(name, getBaseUrlFromRequest(request));
    }


    @Secured("ROLE_ADMIN")
    @PostMapping
    public ProjectDetails createProject(@Valid @RequestBody ProjectDetails projectDetails, HttpServletRequest request) {
        return projectService.createProject(projectDetails, getBaseUrlFromRequest(request));
    }

    @Secured("ROLE_ADMIN")
    @PutMapping()
    public ProjectDetails updateProject(@Valid @RequestBody ProjectDetails projectDetails, HttpServletRequest request) {
        return projectService.updateProject(projectDetails, getBaseUrlFromRequest(request));
    }
}
