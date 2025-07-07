package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.component.FileReaderComponent;
import net.zorphy.backend.main.component.FileUrlComponent;
import net.zorphy.backend.main.dto.project.ProjectDetails;
import net.zorphy.backend.main.dto.project.ProjectMetadata;
import net.zorphy.backend.main.entity.Project;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {FileReaderComponent.class, FileUrlComponent.class})
public abstract class ProjectMapper {
    @Mapping(source = "imagePath", target = "imagePath", qualifiedByName = "resolveFileUrl")
    public abstract ProjectMetadata projectToProjectMetadata(Project project);

    @Mapping(source = "project", target = "metadata")
    @Mapping(source = "filePath", target = "content", qualifiedByName = "readHtmlFromMarkdown")
    public abstract ProjectDetails projectToProjectDetails(Project project);
}
