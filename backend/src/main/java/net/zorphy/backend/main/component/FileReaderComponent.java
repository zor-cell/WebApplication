package net.zorphy.backend.main.component;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.mapstruct.Named;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class FileReaderComponent {
    private final ResourceLoader resourceLoader;
    private final Parser parser;
    private final HtmlRenderer renderer;

    public FileReaderComponent(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        parser = Parser.builder()
                .build();
        renderer = HtmlRenderer.builder()
                .build();
    }

    private String readContent(String filePath) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + filePath);
            if (!resource.exists()) {
                return "";
            }

            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }

    @Named("readHtmlFromMarkdown")
    public String readHtmlFromMarkdown(String filePath) {
        String content = readContent(filePath);

        Node document = parser.parse(content);
        return renderer.render(document);
    }

    @Named("readTextFromMarkdown")
    public String readTextFromMarkdown(String filePath, int limit) {
        return readContent(filePath);
    }
}
