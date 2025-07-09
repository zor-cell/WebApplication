package net.zorphy.backend.main.component;

import net.zorphy.backend.config.property.BaseUrlProperty;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class FileUrlComponent {
    private final BaseUrlProperty baseUrlProperty;

    public FileUrlComponent(BaseUrlProperty baseUrlProperty) {
        this.baseUrlProperty = baseUrlProperty;
    }

    private String resolveUrl(String prefix, String filePath) {
        //redirect empty images to placeholder
        if (filePath == null) {
            filePath = prefix.isEmpty() ? "files/static/empty.svg" : "static/empty.svg";
        }

        String baseUrl = baseUrlProperty.getBaseUrl();
        String fullPath = prefix.isEmpty() ? filePath : prefix + "/" + filePath;

        // Normalize slashes
        if (baseUrl.endsWith("/") && fullPath.startsWith("/")) {
            return baseUrl + fullPath.substring(1);
        } else if (!baseUrl.endsWith("/") && !fullPath.startsWith("/")) {
            return baseUrl + "/" + fullPath;
        } else {
            return baseUrl + fullPath;
        }
    }

    @Named("resolveFileUrl")
    public String resolveFileUrl(String filePath) {
        return resolveUrl("files", filePath);
    }

    @Named("resolveStaticUrl")
    public String resolveStaticUrl(String filePath) {
        return resolveUrl("", filePath);
    }
}
