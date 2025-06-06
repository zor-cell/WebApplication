package net.zorphy.backend.main.repository;

import net.zorphy.backend.main.entity.Project;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends Repository<Project, UUID> {
    List<Project> findAll();
}
