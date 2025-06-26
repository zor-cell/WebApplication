package net.zorphy.backend.main.component;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.NodeRenderer;
import org.commonmark.renderer.html.HtmlNodeRendererContext;
import org.commonmark.renderer.html.HtmlNodeRendererFactory;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.renderer.html.HtmlWriter;
import org.mapstruct.Named;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

@Component
public class FileContentReader {
    private final ResourceLoader resourceLoader;
    private final Parser parser;
    private final HtmlRenderer renderer;
    public FileContentReader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        parser = Parser.builder()
                .build();
        renderer = HtmlRenderer.builder()
                .build();
    }

    private String readContent(String filePath) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + filePath);
            if(!resource.exists()) {
                return "";
            }

            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch(IOException e) {
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
