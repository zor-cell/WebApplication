package net.zorphy.backend.config;

import jakarta.annotation.PostConstruct;
import net.zorphy.backend.config.property.FileStorageProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final FileStorageProperty fileStorageProperty;

    public WebConfig(FileStorageProperty fileStorageProperty) {
        this.fileStorageProperty = fileStorageProperty;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200", "https://zorphy.net")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map the URL path /uploads/files/** to the file system directory where your files are stored
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + fileStorageProperty.getUploadDirectory());
    }
}