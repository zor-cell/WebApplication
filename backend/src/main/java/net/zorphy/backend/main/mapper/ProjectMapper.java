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

    @Named("imageFromPath")
    public String imageFromPath(String imagePath, @Context String baseUrl) {
        if (imagePath == null) return null;

        if (baseUrl.endsWith("/") && imagePath.startsWith("/")) {
            return baseUrl + imagePath.substring(1);
        } else if (!baseUrl.endsWith("/") && !imagePath.startsWith("/")) {
            return baseUrl + "/" + imagePath;
        } else {
            return baseUrl + imagePath;
        }
    }

    @Named("contentFromPath")
    public String contentFromPath(String filePath, @Context FileContentReader fileContentReader) {
        return fileContentReader.readHtmlFromMarkdown(filePath);
    }

    @Mapping(source = "imagePath", target = "imagePath", qualifiedByName = "imageFromPath")
    public abstract ProjectMetadata projectToProjectMetadata(Project project, @Context String baseUrl);

    @Mapping(source = "project", target = "metadata")
    @Mapping(source = "filePath", target = "content", qualifiedByName = "contentFromPath")
    public abstract ProjectDetails projectToProjectDetails(Project project, @Context String baseUrl, @Context FileContentReader fileContentReader);
}
