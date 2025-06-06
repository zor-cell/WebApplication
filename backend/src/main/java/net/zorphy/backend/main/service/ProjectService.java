package net.zorphy.backend.main.service;

import jakarta.servlet.http.HttpServletRequest;
import net.zorphy.backend.main.dto.response.ProjectDetails;
import net.zorphy.backend.main.dto.response.ProjectMetadata;

import java.util.List;

public interface ProjectService {
    List<ProjectMetadata> getProjects(String baseUrl);

    ProjectDetails getProject(String name, String baseUrl);
}
