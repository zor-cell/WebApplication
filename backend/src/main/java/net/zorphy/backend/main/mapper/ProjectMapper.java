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

    @Named("descriptionFromPath")
    public String descriptionFromPath(String filePath, @Context FileContentReader fileContentReader) {
        final int LIMIT = 25;
        return fileContentReader.readTextFromMarkdown(filePath, LIMIT);
    }

    @Named("contentFromPath")
    public String contentFromPath(String filePath, @Context FileContentReader fileContentReader) {
        return fileContentReader.readHtmlFromMarkdown(filePath);
    }

    @Mapping(source = "imagePath", target = "imagePath", qualifiedByName = "imageFromPath")
    @Mapping(source = "filePath", target = "description", qualifiedByName = "descriptionFromPath")
    public abstract ProjectMetadata projectToProjectMetadata(Project project, @Context String baseUrl, @Context FileContentReader fileContentReader);

    @Mapping(source = "project", target = "metadata")
    @Mapping(source = "filePath", target = "content", qualifiedByName = "contentFromPath")
    public abstract ProjectDetails projectToProjectDetails(Project project, @Context String baseUrl, @Context FileContentReader fileContentReader);
}
