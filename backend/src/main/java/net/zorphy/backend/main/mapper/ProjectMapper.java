package net.zorphy.backend.main.mapper;

import net.zorphy.backend.main.component.FileContentReader;
import net.zorphy.backend.main.dto.response.ProjectDetails;
import net.zorphy.backend.main.dto.response.ProjectMetadata;
import net.zorphy.backend.main.entity.Project;
import org.commonmark.node.Node;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;

@Mapper(componentModel = "spring", uses = FileContentReader.class)
public abstract class ProjectMapper {

    @Named("contentFromPath")
    public String contentFromPath(String filePath, @Context FileContentReader fileContentReader) {
        return fileContentReader.readHtmlFromMarkdown(filePath);
    }

    public abstract ProjectMetadata projectToProjectMetadata(Project project);

    @Mapping(source = "project", target = "metadata")
    @Mapping(source = "filePath", target = "content", qualifiedByName = "contentFromPath")
    public abstract ProjectDetails projectToProjectDetails(Project project, @Context FileContentReader fileContentReader);
}
