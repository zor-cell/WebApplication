package net.zorphy.backend.main.service;

import net.zorphy.backend.main.component.FileContentReader;
import net.zorphy.backend.main.dto.ProjectDetails;
import net.zorphy.backend.main.dto.ProjectMetadata;
import net.zorphy.backend.main.entity.Project;
import net.zorphy.backend.main.exception.NotFoundException;
import net.zorphy.backend.main.mapper.ProjectMapper;
import net.zorphy.backend.main.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final FileContentReader fileContentReader;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper, FileContentReader fileContentReader) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.fileContentReader = fileContentReader;
    }

    @Override
    public List<ProjectMetadata> getProjects(String baseUrl) {
        return projectRepository.findAll()
                .stream()
                .map(project -> projectMapper.projectToProjectMetadata(project, baseUrl, fileContentReader))
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDetails getProject(String name, String baseUrl) {
        Project project = projectRepository.findByName(name);
        if(project == null) {
            throw new NotFoundException(String.format("Project with name %s not found", name));
        }

        return projectMapper.projectToProjectDetails(project, baseUrl, fileContentReader);
    }

    @Override
    public ProjectDetails updateProject(ProjectDetails projectDetails, String baseUrl) {
        ProjectMetadata metadata = projectDetails.metadata();

        Project project = projectRepository.findByName(metadata.name());
        if(project == null) {
            throw new NotFoundException("Project with name %s not found".formatted(metadata.name()));
        }

        project.setName(metadata.name());
        project.setCreatedAt(metadata.createdAt());
        project.setDescription(metadata.description());
        project.setGithubUrl(metadata.githubUrl());
        project.setHasWebsite(metadata.hasWebsite());
        project.setIsFavorite(metadata.isFavorite());
        project.setFilePath(projectDetails.filePath());

        //remove host from image path before update
        URI uri = URI.create(metadata.imagePath());
        String path = uri.getPath();
        project.setImagePath(path.startsWith("/") ? path.substring(1) : path);

        Project updated = projectRepository.save(project);
        return projectMapper.projectToProjectDetails(updated, baseUrl, fileContentReader);
    }
}
