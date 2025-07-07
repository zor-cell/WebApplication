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

    @Named("resolveFileUrl")
    public String resolveFileUrl(String filePath) {
        if (filePath == null) return null;

        String baseUrl = baseUrlProperty.getBaseUrl();
        if (baseUrl.endsWith("/") && filePath.startsWith("/")) {
            return baseUrl + filePath.substring(1);
        } else if (!baseUrl.endsWith("/") && !filePath.startsWith("/")) {
            return baseUrl + "/" + filePath;
        } else {
            return baseUrl + filePath;
        }
    }
}
