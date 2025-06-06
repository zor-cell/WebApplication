package net.zorphy.backend.main.service;

import net.zorphy.backend.main.component.FileContentReader;
import net.zorphy.backend.main.dto.response.ProjectDetails;
import net.zorphy.backend.main.dto.response.ProjectMetadata;
import net.zorphy.backend.main.entity.Project;
import net.zorphy.backend.main.mapper.ProjectMapper;
import net.zorphy.backend.main.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<ProjectMetadata> getProjects() {
        return projectRepository.findAll()
                .stream()
                .map(projectMapper::projectToProjectMetadata)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDetails getProject(String name) {
        Project project = projectRepository.findByName(name);
        return projectMapper.projectToProjectDetails(project, fileContentReader);
    }
}
