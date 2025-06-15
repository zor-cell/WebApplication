package net.zorphy.backend.main.component;

import org.commonmark.node.Heading;
import org.commonmark.node.Node;
import org.commonmark.node.Paragraph;
import org.commonmark.node.Text;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.mapstruct.Named;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class FileContentReader {
    private final ResourceLoader resourceLoader;
    private final Parser parser;
    private final HtmlRenderer renderer;
    public FileContentReader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        parser = Parser.builder().build();
        renderer = HtmlRenderer.builder().build();
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

    private static boolean extractTextSkippingHeaders(Node node, StringBuilder result, int maxChars) {
        for (Node child = node.getFirstChild(); child != null; child = child.getNext()) {

            // Skip header nodes entirely
            if (child instanceof Heading) {
                continue;
            }

            if (child instanceof Text) {
                String literal = ((Text) child).getLiteral();
                int remaining = maxChars - result.length();
                if (remaining <= 0) return true;
                if (literal.length() > remaining) {
                    result.append(literal, 0, remaining);
                    return true;
                } else {
                    result.append(literal);
                }
            } else {
                // Recursively process children nodes
                boolean done = extractTextSkippingHeaders(child, result, maxChars);
                if (done) return true;
            }
        }
        return false;
    }

    @Named("readHtmlFromMarkdown")
    public String readHtmlFromMarkdown(String filePath) {
        String content = readContent(filePath);

        Node document = parser.parse(content);
        return renderer.render(document);
    }

    @Named("readTextFromMarkdown")
    public String readTextFromMarkdown(String filePath, int limit) {
        String content = readContent(filePath);

        Node document = parser.parse(content);
        return getFirstParagraph(document.getFirstChild());
    }

    private String getFirstParagraph(Node node) {
        if(node == null) {
            return "";
        }

        if(node instanceof Heading) {
            return getFirstParagraph(node.getNext());
        } else if (node instanceof Paragraph) {
            return getFirstParagraph(node.getFirstChild());
        } else if(node instanceof Text text) {
            return text.getLiteral();
        }

        return "";
    }
}
