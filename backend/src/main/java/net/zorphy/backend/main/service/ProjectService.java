package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.response.ProjectMetadata;

import java.util.List;

public interface ProjectService {
    List<ProjectMetadata> getProjects();
}
