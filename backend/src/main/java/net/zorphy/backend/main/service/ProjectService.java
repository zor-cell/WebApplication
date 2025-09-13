package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.project.ProjectDetails;
import net.zorphy.backend.main.dto.project.ProjectMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    List<ProjectMetadata> getProjects(String baseUrl);

    ProjectDetails getProject(String name, String baseUrl);

    ProjectDetails updateProject(ProjectDetails project, String baseUrl);

    ProjectDetails createProject(ProjectDetails project, MultipartFile image, String baseUrl);
}
