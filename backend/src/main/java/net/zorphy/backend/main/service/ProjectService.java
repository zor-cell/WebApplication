package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.ProjectDetails;
import net.zorphy.backend.main.dto.ProjectMetadata;

import java.util.List;

public interface ProjectService {
    List<ProjectMetadata> getProjects(String baseUrl);

    ProjectDetails getProject(String name, String baseUrl);

    ProjectDetails updateProject(ProjectDetails projectUpdate, String baseUrl);
}
