package net.zorphy.backend.main.service;

import net.zorphy.backend.main.dto.response.ProjectMetadata;
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

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public List<ProjectMetadata> getProjects() {
        return projectRepository.findAll()
                .stream()
                .map(projectMapper::projectToProjectMetadata)
                .collect(Collectors.toList());
    }
}
